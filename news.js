
	urls = ['https://cdn.xenophyte.com/bootstrap.min.js','https://cdn.xenophyte.com/vendor/jquery/jquery-3.6.1.min.js'];

	loadScripts(urls, urls.length, function()
	{
		HideAndroidWallet();
		HideDesktopWallet();


		$("#displayAndroidWallet").click(function()
		{
			if (showAndroidWallet == false)
			{
				ShowAndroidWallet();
    				$('html, body').animate({
					scrollTop: $("#displayAndroidWallet").offset().top
				}, 1000);
			}
			else
			{
    				$('html, body').animate({
					scrollTop: $("#displayAndroidWallet").offset().top
				}, 1000);
				HideAndroidWallet();
			}
		});

		$("#displayDesktopWallet").click(function()
		{
			if (showDesktopWallet == false)
			{
				ShowDesktopWallet();
    				$('html, body').animate({
					scrollTop: $("#displayDesktopWallet").offset().top
				}, 1000);
			}
			else
			{
    				$('html, body').animate({
					scrollTop: $("#displayDesktopWallet").offset().top
				}, 1000);
				HideDesktopWallet();
			}
		});
	});

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


	var showDesktopWallet = false;
	var showAndroidWallet = false;

	function HideAndroidWallet()
	{
		document.getElementById("androidWallet").style="display:none";
		document.getElementById("displayAndroidWallet").innerHTML = "Display android wallet";
		showAndroidWallet = false;
	}

	function ShowAndroidWallet()
	{
		document.getElementById("androidWallet").style="display:visible";
		document.getElementById("displayAndroidWallet").innerHTML = "Hide android wallet";
		showAndroidWallet = true;
	}


	function HideDesktopWallet()
	{
		document.getElementById("desktopWallet").style="display:none";
		document.getElementById("displayDesktopWallet").innerHTML = "Display future wallet";
		showDesktopWallet = false;
	}

	function ShowDesktopWallet()
	{
		document.getElementById("desktopWallet").style="display:visible";
		document.getElementById("displayDesktopWallet").innerHTML = "Hide future wallet";
		showDesktopWallet = true;
	}
