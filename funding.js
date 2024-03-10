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

	var BitcoinWalletAddressFunding = "39mUsJFhjU6GDrchCkQ4iJsmdvD8S2jpzU";
	var BitcoinDecimalHeight = 100000000;

	function GetCurrentBitcoinWalletBalanceFunding()
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data = JSON.parse(xmlHttp.responseText);
				var btcBalance = parseFloat(data.data.received)/BitcoinDecimalHeight;
				var btcPendingBalance = toFixedTrunc(parseFloat(data.data.unconfirmed_received)/BitcoinDecimalHeight, 8);
				var btcCurrentBalance = toFixedTrunc(0, 8);
				var btcTotalReceived = toFixedTrunc(parseFloat(data.data.received)/BitcoinDecimalHeight, 8);

				if (btcBalance > 0)
					btcCurrentBalance = toFixedTrunc(btcBalance - btcPendingBalance, 8);

				document.getElementById("XenophyteCurrentBalanceBtcFunding").innerHTML = btcCurrentBalance;
				document.getElementById("XenophytePendingBalanceBtcFunding").innerHTML = btcPendingBalance;
				document.getElementById("XenophyteTotalBtcReceived").innerHTML = btcTotalReceived;

				GetCurrentCurecoinWalletBalanceFunding();
			}
		}
		xmlHttp.open("GET", "https://lang.xenophyte.com/cure", true); // async
		xmlHttp.send();
	}


	function GetCurrentCurecoinWalletBalanceFunding()
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 

			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				
				var data = JSON.parse(xmlHttp.responseText);

				
				document.getElementById("XenophyteCurrentBalanceCurecoinFunding").innerHTML = data[0].b;
				document.getElementById("XenophytePendingBalanceCurecoinFunding").innerHTML = 0;
			}
		}
		xmlHttp.open("GET", "https://lang.xenophyte.com/btc", true); // async
		xmlHttp.send();
	}


	function toFixedTrunc(value, n)
	{
		const v = value.toString().split('.');
		if (n <= 0) 
			return v[0];

		let f = v[1] || '';

		if (f.length > n)
			return `${v[0]}.${f.substr(0,n)}`;

		while (f.length < n)
			f += '0';

  		return `${v[0]}.${f}`
	}


	urls = ['https://cdn.xenophyte.com/bootstrap.min.js', 'https://cdn.xenophyte.com/vendor/jquery/jquery-3.6.1.min.js'];

	loadScripts(urls, urls.length, function()
	{
		GetCurrentCurecoinWalletBalanceFunding();
		GetCurrentBitcoinWalletBalanceFunding();

		setInterval(GetCurrentBitcoinWalletBalanceFunding, 5000);
		setInterval(GetCurrentCurecoinWalletBalanceFunding, 5000);

	});
