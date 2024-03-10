

	function loadScripts(urls, length, success)
	{
    		if(length > 0)
		{
        		script = document.createElement("SCRIPT");
        		script.src = urls[length-1];
        		script.onload = function()
			{
				loadScripts(urls, length-1, success);               
			};
			document.getElementsByTagName("head")[0].appendChild(script);
    		}
    		else
        		if(success)
            			success();
	}

	urls = ['https://cdn.xenophyte.com/vendor/jquery/jquery-3.6.1.min.js'];


	// Get user country.
	function GetUserLanguage()
	{
		$.getJSON('https://json.geoiplookup.io/?callback=?', function(data) {
			$.getJSON('https://lang.xenophyte.com/'+data.country_code, function(result) {
				Object.keys(result.Content).forEach(function(k){
					var element = document.getElementById(k);
					if (element != undefined)
						element.innerHTML = result.Content[k];
				});

			});	
		});	
	}

	loadScripts(urls, urls.length, function()
	{
		GetUserLanguage();

	});
