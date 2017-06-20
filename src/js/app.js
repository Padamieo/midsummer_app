
// check if we are developing the app
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady(){

  start_game();

}

function start_game(){
  var _ = require('lodash');

}
var _ = require('lodash');
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

    var task = $( this ).data('rel');

    var data = new Array();
    $( '.input' ).each(function(){
      var value = parseInt($(this).val(), 10);
      var title = $(this).attr("name");
      var obj = {title: title, value: value };
      data.push( obj );
    });

    var storeName = ui.store_term+task;
    ui.processANDStore( storeName, data );

  });

  $(document).on('click', '.page', function() {
    var task = $( this ).data( 'rel' );
    var destination = $( this ).data( 'page' );
    if(destination == 'next'){
      ui.changePage( task+1 );
    }
    if(destination == 'prev'){
      ui.changePage( task-1 );
    }
  });

  ui.build();

});
