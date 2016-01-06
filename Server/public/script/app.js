var valueAdded = 'false';
$('#divStatus').innerText = "Loading..";
$('#divStatus_').show();
var app = angular.module('app', ['autocomplete']);

//var moreMovies = ["When I have navigated to Credit Balance Refund", "When I have selected yes for Credit Balance Refund and confirmed the address","Hello"];
var moreMovies = [];
// the service that retrieves some movie title from an url
app.factory('MovieRetriever', function($http, $q, $timeout){
  var MovieRetriever = new Object();
  document.getElementById('divStatus').innerText = "Loading suggestions..";
  $http({
    method: 'GET',
    url: '/api/getsuggestions/1'
  })
  .success(function (data)
  {             
   moreMovies = data[0].Verbs;
   $('#divStatus_').hide();
   $('#divStatus').innerText = "";
   document.getElementById('divStatus').innerText = "";
 });       


  MovieRetriever.getmovies = function(i) {
    var moviedata = $q.defer();
    var movies;

    //var someMovies = ["When I have navigated to Credit Balance Refund", "When I have selected yes for Credit Balance Refund and confirmed the address", ];

    //var moreMovies = ["When I have navigated to Credit Balance Refund", "When I have selected yes for Credit Balance Refund and confirmed the address","Hello"];




    if(i && i.indexOf('T')!=-1)
      movies=moreMovies;
    else
      movies=moreMovies;

    $timeout(function(){
      moviedata.resolve(movies);
    },1000);

    return moviedata.promise
  }

  return MovieRetriever;
});

app.controller('MyCtrl', function($scope,$http, MovieRetriever){

  $scope.movies = MovieRetriever.getmovies("...");
  $scope.movies.then(function(data){
    $scope.movies = data;
  });

  $scope.getmovies = function(){
    return $scope.movies;
  }

  $scope.doSomething = function(typedthings){
    console.log("Do something like reload data with this: " + typedthings );
    $scope.newmovies = MovieRetriever.getmovies(typedthings);
    $scope.newmovies.then(function(data){
      $scope.movies = data;
    });
  }

  $scope.doSomethingElse = function(suggestion){
    //console.log("Suggestion selected: " + suggestion );
    
    //$('#txtEditBox').append(suggestion ); 
    var box = $("#txtEditBox");
    box.val(box.val() + suggestion);
    $('#txtSuggestionBox').val("");
    //valueAdded = 'true';
    //alert(suggestion);
    //suggestion = "";
  }

  $scope.updateSuggestion = function(applicationName){
    //console.log("Suggestion selected: " + suggestion );
    
    //$('#txtEditBox').append(suggestion ); 
    var box = $("#txtEditBox");
    box.val(box.val() + suggestion);
    $('#txtSuggestionBox').val("");
    //valueAdded = 'true';
    //alert(suggestion);
    //suggestion = "";
  }

  $scope.changedValue=function(item){
    //$scope.itemList.push(item.name);
    //$scope.colors = [{"AppID":1,"AppName": "IRIS" }]
    document.getElementById('divStatus').innerText = "Reloading Suggestion..";
    $('#divStatus_').show();
    $http({
      method: 'GET',
      url: './api/getsuggestions/' + item.AppID
    })
    .success(function (data)
    {             
     moreMovies = data[0].Verbs;
     $('#divStatus').innerText = "";
     $('#divStatus_').hide();
     document.getElementById('divStatus').innerText = "";
   });  

    $http({
      method: 'GET',
      url: './api/getfeatures/' + item.AppID
    })
    .success(function (data)
    {             
     $scope.Features = data;//.FeaturesItems;
   });      
  }    
  $scope.Features = [];

  $http({
    method: 'GET',
    url: './api/getappslist'
  })
  .success(function (data)
  {             
   $scope.colors = data;
   $scope.selctedApplication = $scope.colors[0]
   $http({
    method: 'GET',
    url: './api/getfeatures/' + $scope.colors[0].AppID
  })
  .success(function (data)
  {             
   $scope.Features = data;
   $scope.selctedApplication = $scope.colors[0]
 }); 
 }); 




  $scope.signinError = "";
  $scope.allowAdmin = true;
  $scope.SignIn = function(){
       var mydata = {
         userid:$scope.userName, 
    password:$scope.password
    };
    $http({
      method: 'POST',
      data: mydata,
      url: './api/authenticate'
    })
    .success(function (data)
    {  
      if(data != "99"){           
        if(data[0].isadmin == 'Y')
        {
          $scope.allowAdmin = true;
        }
       CloseBanner();
      }else{
         $scope.signinError =  "Username or Password is wrong."
      }
       
   });
  };

  $scope.toggleSearchPane = true;
  $scope.toggleSearch = function() {
    $scope.toggleSearchPane = !$scope.toggleSearchPane;
  };

  $scope.filterFunction = function(element) {
    return element.name.match(/^Ma/) ? true : false;
  };

  $scope.ShowScenarios = function(_id){
    var id = _id;
    $( "#"+id ).last().addClass( "itemMouseOverStyle" );
    $("#itemCtrl"+id).animate({display: 'none'});

    $("#itemCtrl"+id).removeClass( "hidden" );
  }

  $scope.HideScenarios = function(_id){
    var id = _id;
    $( "#"+id ).last().addClass( "itemMouseOverStyle" );
    $("#itemCtrl"+id).animate({display: 'none'});
    $("#itemCtrl"+id).addClass( "hidden" );
  }

  $scope.OpenWindow = function(_id){
    var id = _id;
    var w = window.open('', '', 'width=800,height=400,resizeable,scrollbars,left=10%');
    w.document.write(document.getElementById('scenarioSteps'+ id).innerHTML);
    w.document.close();
  }

  $scope.OpenCloseSettings = function(_id){
    $("settingsPage").removeClass( "hidden" );
    $("settingsPage").animate({display: 'block'});
  }

  $scope.AddNewApplication = function(){
    var mydata = {appid:"", 
    appname: $scope.appName,     
    sourceType: $scope.sourceType,      
    sourceUrl:$scope.sourceUrl ,
    sourcePath:$scope.sourcePath,
    username: $scope.username,
    password: $scope.password,
    userdomain: $scope.userdomain};
    $http({
      method: 'POST',
      data: mydata,
      url: './api/addsetting'
    })
    .success(function (data)
    {             
     $scope.SettingsData = data;
     $http({
      method: 'GET',
      url: './api/getsettings'
    })
     .success(function (data)
     {             
       $scope.SettingsData = data;
       hideAddSource();
     }); 
   }); 

  }


  $scope.DeleteSetting = function(_id){

    $http({
      method: 'DELETE',
      url: './api/deletesetting/'+_id
    })
    .success(function (data)
    {             
     $scope.SettingsData = data;
         $http({
      method: 'GET',
      url: './api/getsettings'
    })
     .success(function (data)
     {             
       $scope.SettingsData = data;
       hideAddSource();
     }); 

  });
  }
  
  
 $scope.OpenSettings =  function  (){
    $("#settingsPage").removeClass( "hidden" );
    $("#settingsPage").animate({display: 'block'});
    $("#searchPane").addClass("hidden");
     $http({
    method: 'GET',
    url: './api/getsettings'
  })
  .success(function (data)
  {             
   $scope.SettingsData = data;
 }); 


  }



 

/*
  $scope.colors = [
      {name:'black', shade:'dark'},
      {name:'white', shade:'light', notAnOption: true},
      {name:'red', shade:'dark'},
      {name:'blue', shade:'dark', notAnOption: true},
      {name:'yellow', shade:'light', notAnOption: false}
    ];
    */
  });


function SuggestionBoxClick(){
  //    $('#txtEditBox').append($('#txtSuggestionBox').val("") ); 
   // $('#txtSuggestionBox').val("");
               //onClick="SuggestionBoxClick();"\
             }

             $(document).ready(function(){
  //  $("#txtSuggestionBox").focusin(function(){
  //      $(this).css("background-color", "#FFFFCC");
  //  });
/*
    $("#txtSuggestionBox").focusout(function(){
        $('#txtEditBox').append($('#txtSuggestionBox').val() + '\n' ); 
        $( "#txtSuggestionBox" ).focus();
        $('#txtSuggestionBox').val(""); 
    });
             */
             $("#txtSuggestionBox").keypress(function (e) {

               if (e.which == 13 && valueAdded == 'false'){
                 // $('#txtEditBox').append($('#txtSuggestionBox').val() + '\n' ); 
                 var box = $("#txtEditBox");
                 box.val(box.val() + $('#txtSuggestionBox').val() + "\n");
                 $( "#txtSuggestionBox" ).focus();
                 $('#txtSuggestionBox').val(""); 
                 valueAdded = 'false';
               }

             });
           });


             function copyTextToClipboard(text) {
              text = document.getElementById('txtEditBox').value;
              var textArea = document.createElement("textarea");


  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

function ClearText() {
  // body...
  copyTextToClipboard('');
  document.getElementById('txtEditBox').value = '';
}

setTimeout(function() {
    //$('#banner').fadeOut('slow');
  }, 4000); 


function fetMouseOver(currentItem){
  /*
  var id = currentItem.id;
  $( "#"+id ).last().addClass( "itemMouseOverStyle" );
  $("#itemCtrl"+id).animate({display: 'none'});
  
  $("#itemCtrl"+id).removeClass( "hidden" );
  */
}

function fetMouseOut(currentItem){
  /*
  var id = currentItem.id;
  $( "#"+id ).last().addClass( "itemMouseOverStyle" );
  $("#itemCtrl"+id).animate({display: 'none'});
  $("#itemCtrl"+id).addClass( "hidden" );
  */

}


function open_popup(currentItem) {
    //$("#scenarioSteps"+ currentItem.id).removeClass( "hidden" );
    var w = window.open('', '', 'width=800,height=400,resizeable,scrollbars,left=10%');
    w.document.write(document.getElementById('scenarioSteps'+ currentItem.id).innerHTML);
    w.document.close(); // needed for chrome and safari
  }

  function OpenSettings (){
    $("#settingsPage").removeClass( "hidden" );
    $("#settingsPage").animate({display: 'block'});
    $("#searchPane").addClass("hidden");

  }

  function CloseSettings (){
    $("#settingsPage").addClass( "hidden" );
    $("#settingsPage").animate({display: 'none'});
    $("#searchPane").removeClass("hidden");
  }

  function CloseBanner(){
    $('#banner').fadeOut('slow');
  }

  function showAddSource(){

    $("#addNewSource").removeClass( "hidden" );
    $("#addNewSource").animate({display: 'block'});
  }
  function hideAddSource(){

    $("#addNewSource").addClass( "hidden" );
    $("#addNewSource").animate({display: 'none'});
  }
