var ui = {
  store_term: 'task_',
  page: 4,
  total: 0,
  light: 0,
  dark: 0,
  diamonds: 0,
  clubs: 0,
  spades: 0,
  hearts: 0
};

ui.build = function () {
  var currentPage = ui.page;

  if( currentPage == 1 || currentPage == 2 || currentPage == 3 ){
    var data = this.getData( currentPage );
    this.handlebars( data );
  }else{
    if( currentPage == 4 ){

      var results = this.processResults();
      var title = this.getPageTitle( currentPage );

      var per = (ui.total/100);
      var percentage = ui.light/per; //(ui.light/per)*0.95;

      var hearts = ui.hearts/per; //(ui.hearts/per)*1.3;
      var diamonds = ui.diamonds/per; //(ui.diamonds/per)*0.7;
      var clubs = ui.clubs/per; //(ui.clubs/per)*1.1;
      var spades = ui.spades/per;
      var houses = {
        diamonds: ( diamonds !=0 ? diamonds : 1 ),
        hearts: ( hearts !=0 ? hearts : 1 ),
        clubs: ( clubs !=0 ? clubs : 1 ),
        spades: ( spades !=0 ? spades : 1 )
      };

      var data = {
        page: title,
        results: results,
        light: ui.light,
        dark: ui.dark,
        total: ui.total,
        percentage: percentage,
        houses: houses,
        prev: true,
        rel: currentPage
      };
      this.handlebars( data, 'results' );

    }

  }

};

ui.processResults = function (){
  var raw = this.baseData();
  //remove deactivated

  var array = [];
  for (var i = 1; i < 4; i++) {
    var storeName = this.store_term+i;
    var storedData = this.getStore( storeName );
    var stored = JSON.parse( storedData );
    array.push( stored );
  }

  //reset just in case
  ui.light = 0;
  ui.dark = 0;
  ui.diamonds = 0;
  ui.hearts = 0;
  ui.clubs = 0;
  ui.spades = 0;
  ui.total = 0;

  for ( var i = 0; i < raw.length; i++ ) {
    var title = raw[i].title;
    var result_1 = $.grep(array[0], function(e){ return e.title == title; })[0];
    var result_2 = $.grep(array[1], function(e){ return e.title == title; })[0];
    //var result_3 = $.grep(array[2], function(e){ return e.title == title; });

    var points = result_1.value + result_2.value;

    if( raw[i].suit == 'd' ){
      ui.light = ui.light + points;
      ui.diamonds = ui.diamonds + points;
    }
    if( raw[i].suit == 'h' ){
      ui.light = ui.light + points;
      ui.hearts = ui.hearts + points;
    }
    if( raw[i].suit == 'c' ){
      ui.dark = ui.dark + points;
      ui.clubs = ui.clubs + points;
    }
    if( raw[i].suit == 's' ){
      ui.dark = ui.dark + points;
      ui.spades = ui.spades + points;
    }

    ui.total = ui.total + points;
    raw[i].total = points;
  }

  raw.sort(function(a, b) {
    return parseFloat(b.total) - parseFloat(a.total);
  });

  return raw;
};

ui.getData = function ( input ){
  var task = ( input ? input : 1 );
  var title = this.getPageTitle( task );
  var raw = this.baseData();
  if( task === 3 ){
    var raw = this.reduceRaw( raw );
  }
  var processedData = ( task < 4 && task > 0 ? this.checkStore( raw, task ) : false );
  var data = {
    page: title,
    inputs: processedData,
    save: ( task <= 3 ? true : false ),
    next: ( task == 1 || task == 2 ? true : false ),
    prev: ( task == 2 || task == 3 ? true : false ),
    results: ( task == 3 ? true : false ),
    rel: task
  };
  return data;
};

ui.reduceRaw = function ( raw ){
  var allowed = ['love', 'insanity', 'time', 'nature', 'fate', 'sound'];
  for (var i = raw.length-1; i >= 0; i-- ){
    var needle = raw[i].title;
    if(!allowed.includes(needle)){
      raw.splice(i,1);
    }
  }
  return raw;
};

ui.processANDStore = function( storeName, unproccessed_data ){
  var dataJSON = JSON.stringify( unproccessed_data );
  ui.setStore( storeName, dataJSON );
};

ui.checkStore = function ( raw, task ){
  var storeName = this.store_term+task;
  var storedData = this.getStore( storeName );

  if(storedData == '' || storedData == null || storedData == 'null'){
    var processedData = [];
    for (var i = 0; i < raw.length; i++) {
      processedData[i] = { title: raw[i].title, value: 0 };
    }
    this.processANDStore( storeName, processedData );
    storedData = this.getStore( storeName );
  }

  var stored = JSON.parse( storedData );
  for (var i = 0; i < raw.length; i++) {
    var title = raw[i].title;
    for (var y = 0; y < stored.length; y++) {
      if( title == stored[y].title){
        raw[i].value = stored[y].value;
      }
    }
  };

  return raw;
};

ui.baseData = function ( ){
  var baseData = [
    {title:'sun', name: 'David', suit: 'd'},
    {title:'skill', name: 'Andrew', suit: 'd'},
    {title:'technology', name: 'Lewis', suit: 'd'},
    {title:'nature', name: 'Jane', suit: 'd'},
    {title:'justice', name: 'Carolyn', suit: 'd'},
    {title:'strength', name: 'Nick', suit: 'd'},
    {title:'medicine', name: 'Karen', suit: 'd'},
    {title:'love', name: 'Alex', suit: 'h'},
    {title:'luck', name: 'Lyn', suit: 'h'},
    {title:'stars', name: 'Tina', suit: 'h'},
    {title:'time', name: 'Bill', suit: 'c'},
    {title:'magic', name: 'Max', suit: 'c'},
    {title:'insanity', name: 'Calum', suit: 'c'},
    {title:'fate', name: 'Simon', suit: 'c'},
    {title:'wealth', name: 'Sophie', suit: 's'},
    {title:'moon', name: 'Hilary', suit: 's'},
    {title:'beauty', name: 'Lauren', suit: 's'},
    {title:'wine', name: 'Carl', suit: 's'},
    {title:'sound', name: 'Cameron', suit: 's'}
  ];
  return baseData;
};

ui.changePage = function( destination ){
  //if( destination >= 1 && destination <= 4 ){
    this.page = destination;
    this.build();
  //}
};

ui.getPageTitle = function ( task ){
  var title = 'Results';

  title = ( task == 1 ? 'First Tasks' : title );
  title = ( task == 2 ? 'Second Tasks' : title );
  title = ( task == 3 ? 'Third Tasks' : title );

  return title;
}

ui.handlebars = function( data, template ){
  var set_template = (template ? template : 'default' );
  var postTemplate = templates["JST"]["src/templates/"+set_template+".hbs"]; // how do we know which template to use
  var html = postTemplate( data ); // not sure what we are doing here
  this.swapContent( html );
};

ui.swapContent = function( html ){
  $( ".container").replaceWith( '<div class="container">'+html+'</div>' );
};

ui.getStore = function( attribute ){
  if(localStorage != undefined){
    return localStorage.getItem(attribute);
  }
}

ui.setStore = function( attribute, value ){
  if(localStorage != undefined){
    localStorage.setItem(attribute, value );
  }
}


module.exports = ui;
