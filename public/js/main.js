var listener = {

    //This is called when the Browser window has finished loading at startup
    onLoad : function(loadEvent) {
      var textareas = document.getElementsByTagName('textarea')
        , inputs = document.getElementsByTagName('input')
        , key;

      for (key in textareas) {
        if (textareas.hasOwnProperty(key)) {
          textareas[key].addEventListener('focus', listener.onFocus, false);
          textareas[key].addEventListener('blur', listener.onBlur, false);
        }
      }

      for (key in inputs) {
        if (inputs.hasOwnProperty(key)) {
          if (inputs[key].type === 'text') {
            inputs[key].addEventListener('focus', listener.onFocus, false);
            inputs[key].addEventListener('blur', listener.onBlur, false);
          }
        }
      }
    },

    onFocus : function(event) {
      var dataDefault = event.target.getAttribute('data-default')
        , value = event.target.value;
      if (value === dataDefault) {
        event.target.value = '';
      }
    },
    onBlur : function(event) {
      var dataDefault = event.target.getAttribute('data-default')
        , value = event.target.value;

      if (value === '') {
        event.target.value = dataDefault;
      }
    }
};

window.addEventListener("load", listener.onLoad, false);
