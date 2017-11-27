$(document).ready(() => {

  //tässä asetetaan näytettävän kyselyn id
  var kysid = 1;
  //Tässä ajax-funktiossa haetaan json-data palvelimelta ja asetetaan se data-olioon
  $.ajax({
    url: encodeURI("http://proto324.haaga-helia.fi/kysely-0.3.2/rest/kyselyt/" + kysid),
    dataType: "json",
    timeout: 5000
  }).done((data) => {

    //apumuuttuja lyhentää koodia vähän
    var kys = data.kysymykset

    //asetetaan headeriin kyselyn nimi
    $('.kysymys-title').html(data.nimi);

    //lähdetään tutkimaan dataa
    for (var i = 0; i < kys.length; i++) {
      var uid = kys[i].id;

      //säännöt per input tyyppi
      switch (kys[i].tyyppi) {

        //luodaan pudotusvalikon pohja
        case "select":
          $(".kysymykset").append('<div class="media"><div class="media-content"><h2 class="subtitle">' + kys[i].data + '</h2><br /><div class="select"><select id="' + uid + '"></select></div></div></div><br />')
          break;

        //luodaan range input
        case "range":
          $(".kysymykset").append('<div class="media"><div class="media-content"><h2 class="subtitle" for="' + uid + '"> ' + kys[i].data + ' </h2> <input id="' + uid + '" type="' + kys[i].tyyppi + '" min="1" max="5" value="3" /><output for="' + uid + '" id="' + uid + '">3</output></div></div><br />');
          break;

        //luodaan pohja radio-nappuloille
        case "radio":
          $(".kysymykset").append('<div id="radio-set-' + i + '"><h2 class="subtitle">' + kys[i].data + '</h2></div>')

          break;
        default:

      }

      //muuttaa range-inputin alla olevaa numeroa rangen valuen mukaan
      $('#' + uid).on("change mousemove", function() {
        $(this).next().html($(this).val());
      })

      for (var j = 0; j < kys[i].vaihtoehdot.length; j++) {

        switch (kys[i].tyyppi) {
          //number-input säännöt
          case "number":
            $(".kysymykset").append('<div class="media"><div class="media-content"><h2 class="subtitle" for="' + uid + '">' + kys[i].data + '</h2><input class="input" id="' + uid + '" type="' + kys[i].tyyppi + '" /></div></div><br />');
            break;

          //täytetään radio-nappuloiden pohja radio-nappuloilla
          case "radio":
            $("#radio-set-" + i).append('<div class="media"><div class="media-content"><label class="label" for="' + uid + j + '">' + kys[i].vaihtoehdot[j].data + ' <input class="radio" name="' + kys[i].data + '" id="' + uid + j + '" type="' + kys[i].tyyppi + '" /></div></div><br />');
            break;

          //textarea sääntö
          case "textarea":
            $(".kysymykset").append('<div class="media"><div class="media-content"><h2 class="subtitle" for="' + uid + '">' + kys[i].data + '</h2> <textarea class="textarea" id="' + uid + '" type="' + kys[i].tyyppi + '" /></div></div><br />');
            break;


          //täytetään dropdown-valikko vaihtoehdoilla
          case "select":
            for (var k = 0; k < kys[i].vaihtoehdot.length; k++) {
              $('#' + uid).append('<option id="' + uid + '">' + kys[i].vaihtoehdot[j].data + '</option><br />');
              break;
            }
            break;
          default:
          break;

        }
      }
    }


    //luodaan sivulle lähetä-nappula
    $(".kysymykset").append('<button class="button" id="laheta-nappula" type="submit"" formmethod="post">Lähetä</button>')
  })

  //lähetä-nappulan logiikka
  $(document).on('click', '#laheta-nappula', (e) => {

    //estää lähetä-nappulaa päivittämästä sivua
    e.preventDefault();
    //apumuuttujia
    var dataArray = [];
    var dataObject = {};
    var data;

    //haetaan täytetyn formin dataa
    $('form input, form textarea, form select').each(function(i) {

      //tutkitaan input tyyppiä ja asetetaan sääntöjä
      if ($(this).prop('type') === 'radio') {
        if (!$(this).prop('checked')) {
          return;
        } else {
          data = $(this).parent().text();
        }
      } else {
         data = $(this).val();
      }
      dataObject = {
        data: data
      }
      dataArray.push(dataObject);

    });

    //kiitossivu
    $('.kysymykset').html('<div class="media"><div class="media-content"><h1 class="title">Kiitos vastauksesta!</h1></div></div><br />')

    //lähetetään data palvelimelle
    $.ajax({
      type: "POST",
      url: encodeURI("http://proto324.haaga-helia.fi/kysely-0.3.2/rest/vastaukset/tallenna"),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(dataArray),
      timeout: 5000
    })



  });

});
