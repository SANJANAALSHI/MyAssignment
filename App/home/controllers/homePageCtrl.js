app.controller('homePageController', function($scope, $http, $timeout) {

  let mainData = [];
  $scope.arrayOfSelectedIds = [];
  $scope.searchText = '';
  $scope.activeTab = 'immunization';

  $http({
    method: 'GET',
    url: '/data.json'
  }).then(function(response) {
    mainData = angular.copy(response.data.data);
    $scope.tableData = response.data.data;
    calculateTotalNoOfPages()
  }, function(reason) {
    console.log(reason);
  });

  let parentCheckbox = document.querySelector('input[id="SelectAll"]');

  $scope.selectRow = function(id) {
    let ind = $scope.arrayOfSelectedIds.indexOf(id);
    if (ind == -1) {
      $scope.arrayOfSelectedIds.push(id);
    } else {
      $scope.arrayOfSelectedIds.splice(ind, 1)
    }
    updateParentCheckbox()
  }

  $scope.selectUnselectAllRows = function() {
    for (let i = 0; i < $scope.tableData.length; i++) {
      if (!parentCheckbox.checked && !parentCheckbox.indeterminate) {
        $scope.tableData[i].checked = false;
        $scope.arrayOfSelectedIds = []
      } else {
        if (!$scope.tableData[i].checked) {
          $scope.arrayOfSelectedIds.push($scope.tableData[i].id);
        }
        $scope.tableData[i].checked = true;
      }
    }
  }

  $scope.addNewRow = function() {

    let id;
    if (mainData.length == 0) {
      id = 1;
    } else {
      id = mainData[mainData.length - 1].id + 1
    }

    mainData.push({
      id: id,
      name: $scope.newRow.name,
      description: $scope.newRow.description,
      webReference: $scope.newRow.webReference,
    })

    $scope.newRow = {
      id: '',
      name: '',
      description: '',
      webReference: '',
    }

    $scope.generateTableData()

    document.getElementById("success").classList.add('d-block');
    $timeout(function() {
      document.getElementById("success").classList.remove('d-block');
    }, 3000)

  }

  $scope.deleteSelectedRows = function() {
    for (let i = 0; i < $scope.arrayOfSelectedIds.length; i++) {
      ind = mainData.map((o) => o.id).indexOf($scope.arrayOfSelectedIds[i]);
      mainData.splice(ind, 1);
    }
    $scope.arrayOfSelectedIds = []
    $scope.generateTableData()
  }

  function calculateTotalNoOfPages() {
    $scope.totalNoOfPages = Math.ceil($scope.tableData.length / 15);
  }

  function updateParentCheckbox() {
    let checkedCount = 0;
    for (let i = 0; i < $scope.tableData.length; i++) {
      if ($scope.tableData[i].checked) {
        checkedCount++;
      }
    }

    if (checkedCount === 0) {
      parentCheckbox.checked = false;
      parentCheckbox.indeterminate = false;
    } else if (checkedCount === $scope.tableData.length) {
      parentCheckbox.checked = true;
      parentCheckbox.indeterminate = false;
    } else {
      parentCheckbox.checked = false;
      parentCheckbox.indeterminate = true;
    }
  }

  $scope.startFrom = 0;
  $scope.pageNo = 1;

  $scope.jumpTo = function() {
    if (Number($scope.pageNo) <= $scope.totalNoOfPages) {
      $scope.startFrom = ((Number($scope.pageNo) - 1) * 15)
    } else {

    }
  }

  $scope.prevPage = function() {
    $scope.pageNo = Number($scope.pageNo) - 1;
    $scope.startFrom -= 15;
  };

  $scope.nextPage = function() {
    $scope.pageNo = Number($scope.pageNo) + 1;
    $scope.startFrom += 15;
  };

  /* generate data for table */

  $scope.generateTableData = function() {
    if ($scope.searchText.length == 0) {
      $scope.tableData = angular.copy(mainData)
    } else {
      $scope.tableData = mainData.filter(searchTextInRecords($scope.searchText.toLowerCase()));
    }
    calculateTotalNoOfPages();
    updateParentCheckbox()
  }

  $scope.propertyName = "name";
  $scope.sortByField = "+name";

  $scope.sortBy = function(type, sortPropertyName) {
    if ($scope.propertyName == sortPropertyName) {
      $scope.sortByField = type + "" + sortPropertyName;
    } else {
      $scope.sortByField = "-" + "" + sortPropertyName;
    }
    $scope.propertyName = sortPropertyName;
  }

  function searchTextInRecords(query) {
    return function filterFn(row) {
      let lowerCaseEntity = row.name.toLowerCase();
      return ((row.name.toLowerCase().includes(query)) || (row.description.toLowerCase().includes(query)) || (row.webReference.toLowerCase().includes(query)));
    };
  }

})
