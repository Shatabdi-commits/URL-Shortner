$('.btnShorten').on('click', () => {
  $.ajax({
    url: '/make/shorter',
    type: 'POST',
    dataType: 'JSON',
    data: {url: $('#urlField').val()},
    success: (data) => {
      if(data.shortURL == 'URL_FAILURE!') {
        
        var result = '<a class="result" href="' + 'Invalid URL !' + '">'
            + 'Invalid URL !' + '</a>';
        $('#link').html(result);
        $('#link').hide().fadeIn('slow');
      }
      else {
        
        var result = '<a class="result" href="' + data.shortURL + '">'
            + data.shortURL + '</a>';
        $('#link').html(result);
        $('#link').hide().fadeIn('slow');
      }
    }
  });
});
