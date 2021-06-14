(function() {
    function displaySearchResults(results, store) {
	var numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

	var searchResults = document.getElementById('gallery');
	var column_size = searchResults.getAttribute('data-columnsize');
	var videoposter = searchResults.getAttribute('data-videoposter');
	var videoposter_tag = '';
	if (videoposter != '')
	    videoposter_tag = `poster="${videoposter}"`

	var nb_columns = (9 / column_size);
	var column_size_t = numbers[column_size];

	if (results.length) { // Are there any results?
	    var appendString = '';

	    for (var i = 0; i < results.length; i++) {  // Iterate over the results
		if (i % nb_columns == 0)
		    appendString += '<div id="albums" class="row">';
		var media = store[results[i].ref];
		var path = media.url.substring(0, media.url.lastIndexOf("/"));
		var name = media.url.substring(media.url.lastIndexOf("/") + 1);
		var mhash = name.replaceAll('.', '').replaceAll(' ', '');
		if (media.slides)
		    var slideurl = media.url.substring(0, media.url.lastIndexOf(".")) + "." + media.slides;
		var thumbnail = path + "/" + media.thumbnail;
		appendString += `<div class="${column_size_t} columns thumbnail">
          <a href="#${mhash}" class="gallery" inline="yes" title="${name}">
            <img src="${thumbnail}" alt="${name}"
                title="${media.title}" /></a>
	  <span class="album_title">${media.title}<sup>
		<a href="${media.url}">v</a>`;
		if (media.slides)
		    appendString += `, <a href="${slideurl}">s</a>`;
		appendString += `</sup></span></div><div style="display:none">
          <div id="${mhash}">
            <video ${videoposter_tag} width="100%" height="100%"
	      controls>
              <source src="${media.url}" type="${media.mime}" />
            </video>
          </div>
        </div>`;
		if (i + 1 == results.length ||
		    (i + 1) % nb_columns == 0)
		    appendString += '</div>';
	    }
	    searchResults.innerHTML = appendString;
	} else {
	    searchResults.innerHTML = '';
	}
    }

    function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');

	for (var i = 0; i < vars.length; i++) {
	    var pair = vars[i].split('=');

	    if (pair[0] === variable) {
		return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
	    }
	}
    }

    var searchTerm = getQueryVariable('query');

    if (searchTerm) {
	document.getElementById('search-box').setAttribute("value", searchTerm);

	var idx = lunr(function () {
	    this.field('id');
	    this.field('title');
	    this.field('author');
	    this.field('album');

	    // Add data to lunr
	    for (var key in window.store) {
		this.add({
		    'id': key,
		    'title': window.store[key].title,
		    'author': window.store[key].author,
		    'album': window.store[key].album,
		    'thumbnail': window.store[key].thumbnail,
		    'mime': window.store[key].mime,
		    'slides': window.store[key].slides,
		});
	    }
	});

	var results = idx.search(searchTerm); // Get lunr to perform a search
	displaySearchResults(results, window.store);
    }
})();
