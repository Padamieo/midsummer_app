
// check if we are developing the app
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady(){

  start_game();

}

function start_game(){
  var _ = require('lodash');

}

var Dates = require('dateMath');
$ = require("jquery");
var ui = require("ui");
Handlebars = require("handlebars");
templates = require("templates");

$( document ).ready(function() {

  var now = new Date( '2017-06-24T12:00:00Z' );

  var next_midsummer = new Date( '2018-06-24T12:00:00Z' );

  // var next = Dates.day.ceil(now);
  // console.log( next );

  $(document).on('click', '.submit', function() {
    var arrText = new Array();
    $( '.input' ).each(function(){
      var value = $(this).val();
      //arrText.push($(this).val());
      console.log( value );
    });

    ui.create();

  });

});
