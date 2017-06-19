var ui = {
  store_term: 'task_',
  page: 1
};

ui.build = function () {
  var currentPage = ui.page;
  var data = this.getData( currentPage );
  this.handlebars('menu', data );
};

ui.getData = function ( input ){
  var task = ( input ? input : 1 );
  var title = this.getPageTitle( task );

  var raw = ui.baseData();
  if( task === 3 ){
    var raw = ui.reduceRaw( raw );
  }
  var processedData = ( task < 4 && task > 0 ? ui.checkStore( raw, task ) : false );

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
  var storeName = ui.store_term+task;
  var storedData = ui.getStore( storeName );

  if(storedData == '' || storedData == null || storedData == 'null'){
    var processedData = [];
    for (var i = 0; i < raw.length; i++) {
      processedData[i] = {title: raw[i].title, value: 0};
    }
    ui.processANDStore( storeName, processedData );
    storedData = ui.getStore( storeName );
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
    {title:'sun'},
    {title:'skill', name: 'Andrew'},
    {title:'technology', name: 'Lewis'},
    {title:'nature', name: 'Jane'},
    {title:'justice', name: 'Carolyn'},
    {title:'strength', name: 'Nick'},
    {title:'medicine'},
    {title:'love', name: 'Alex'},
    {title:'luck'},
    {title:'stars'},
    {title:'time', name: 'Bill'},
    {title:'magic', name: 'Max'},
    {title:'insanity', name: 'Calum'},
    {title:'fate', name: 'Simon'},
    {title:'wealth'},
    {title:'moon'},
    {title:'beauty', name: 'Lauren'},
    {title:'wine'},
    {title:'sound', name: 'Cameron'}
  ];
  return baseData;
};

ui.changePage = function( destination ){
  //if( destination >= 1 && destination <= 4 ){
    ui.page = destination;
    ui.build();
  //}
};

ui.getPageTitle = function ( task ){
  var title = 'Results';

  title = ( task == 1 ? 'First Tasks' : title );
  title = ( task == 2 ? 'Second Tasks' : title );
  title = ( task == 3 ? 'Third Tasks' : title );

  return title;
}

ui.handlebars = function(page, data, template){
  var set_template = (template ? template : 'default' );
  var postTemplate = templates["JST"]["src/templates/default.hbs"]; // how do we know which template to use
  var html = postTemplate(data); // not sure what we are doing here
  this.swapContent(page, html);
};

ui.swapContent = function(page, html){
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
