var ui = {
  store_term: 'task_',
  page: 1,
  attending: 0,
  total: 0,
  light: {points:0, tally:0},
  dark: {points:0, tally:0},
  diamonds: {points:0, tally:0},
  clubs: {points:0, tally:0},
  spades: {points:0, tally:0},
  hearts: {points:0, tally:0}
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

      var light_tally = ( ui.light.tally ? ui.light.tally : 0 );
      var dark_tally = ( ui.dark.tally ? ui.dark.tally : 0 );

      var total_tally = light_tally+dark_tally;
      var per_light = (total_tally/light_tally);
      var per_dark = (total_tally/dark_tally);

      var light_points = (ui.light.points*per_light) || 0;
      var dark_points = (ui.dark.points*per_dark) || 0;

      var total = light_points+dark_points;
      var percentage = light_points/(total/100);


      var per_hearts = (total_tally/ui.hearts.tally);
      var heart_points = (ui.hearts.points*per_hearts) || 0;

      var per_diamonds = (total_tally/ui.diamonds.tally);
      var diamonds_points = (ui.diamonds.points*per_diamonds) || 0;

      var per_clubs = (total_tally/ui.clubs.tally);
      var clubs_points = (ui.clubs.points*per_clubs) || 0;

      var per_spades = (total_tally/ui.spades.tally);
      var spades_points = (ui.spades.points*per_spades) || 0;

      var suits_total = heart_points+diamonds_points+clubs_points+spades_points;

      var hearts = heart_points/(suits_total/100);
      var diamonds = diamonds_points/(suits_total/100);
      var clubs = clubs_points/(suits_total/100);
      var spades = spades_points/(suits_total/100);

      var houses = {
        diamonds: { per: diamonds, points: ui.diamonds.points, tally: ui.diamonds.tally },
        hearts: { per: hearts, points: ui.hearts.points, tally: ui.hearts.tally },
        clubs: { per: clubs, points: ui.clubs.points, tally: ui.clubs.tally },
        spades: { per: spades, points: ui.spades.points, tally: ui.spades.tally }
      };

      var data = {
        page: title,
        results: results,
        light: '('+ui.light.points+')/'+ui.light.tally,
        dark: '('+ui.dark.points+')/'+ui.dark.tally,
        total: ui.total,
        attending: ui.attending,
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
  ui.light = {points:0, tally:0};
  ui.dark = {points:0, tally:0};
  ui.diamonds = {points:0, tally:0};
  ui.hearts = {points:0, tally:0};
  ui.clubs = {points:0, tally:0};
  ui.spades = {points:0, tally:0};
  ui.total = 0;
  ui.attending = 0;

  for (var i = raw.length-1; i >= 0; i-- ){
    var title = raw[i].title;
    var result_1 = $.grep(array[0], function(e){ return e.title == title; })[0];
    var result_2 = $.grep(array[1], function(e){ return e.title == title; })[0];
    var points = result_1.value + result_2.value;
    if(points <= 0){
      raw.splice(i,1);
    }
  }

  ui.attending = raw.length;

  for ( var i = 0; i < raw.length; i++ ) {
    var title = raw[i].title;
    var result_1 = $.grep(array[0], function(e){ return e.title == title; })[0];
    var result_2 = $.grep(array[1], function(e){ return e.title == title; })[0];
    //var result_3 = $.grep(array[2], function(e){ return e.title == title; });

    var points = result_1.value + result_2.value;

    if( raw[i].suit == 'd' ){
      ui.light.points = ui.light.points + points;
      ui.light.tally++;
      ui.diamonds.points = ui.diamonds.points + points;
      ui.diamonds.tally++;
    }
    if( raw[i].suit == 'h' ){
      ui.light.points = ui.light.points + points;
      ui.light.tally++;
      ui.hearts.points = ui.hearts.points + points;
      ui.hearts.tally++;
    }
    if( raw[i].suit == 'c' ){
      ui.dark.points = ui.dark.points + points;
      ui.dark.tally++;
      ui.clubs.points = ui.clubs.points + points;
      ui.clubs.tally++;
    }
    if( raw[i].suit == 's' ){
      ui.dark.points = ui.dark.points + points;
      ui.dark.tally++;
      ui.spades.points = ui.spades.points + points;
      ui.spades.tally++;
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
