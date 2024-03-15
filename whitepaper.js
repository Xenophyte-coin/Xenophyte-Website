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
	
	urls = ['https://cdn.xenophyte.com/bootstrap.min.js', 'https://cdn.xenophyte.com/vendor/jquery/jquery-3.6.1.min.js'];

	loadScripts(urls, urls.length, function()
	{

	});
