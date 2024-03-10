
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

	var apiHost = "https://api.xenophyte.com/";

	function GetCoinNetworkInformation()
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data = JSON.parse(xmlHttp.responseText);
				var totalCoinMined = parseFloat(data.coin_total_mined);
				var totalCoinCirculating = parseFloat(data.coin_circulating);
				var totalCoinFee = parseFloat(data.coin_total_fee);
				var totalCoinInPending =  parseFloat(totalCoinMined - (totalCoinCirculating + totalCoinFee)).toFixed(8);

				var syncStatus = "Synced";
				if (totalCoinInPending < 0 || data.coin_total_transaction < data.coin_network_total_transaction)
					syncStatus = "Syncing in pending";

				document.getElementById("CoinMaxSupply").innerHTML = data.coin_max_supply + " " + data.coin_min_name;
				document.getElementById("CoinCirculating").innerHTML = data.coin_circulating + " " + data.coin_min_name;
				document.getElementById("CoinTransactionFee").innerHTML = data.coin_total_fee + " " + data.coin_min_name;
				document.getElementById("CoinMined").innerHTML = data.coin_total_mined + " " + data.coin_min_name;
				document.getElementById("CoinTotalTransaction").innerHTML = data.coin_total_transaction + "/" + data.coin_network_total_transaction;
				document.getElementById("CoinBlockchainHeight").innerHTML = data.coin_blockchain_height;
				document.getElementById("CoinBlockchainLastHeight").innerHTML = (data.coin_max_supply / data.coin_block_reward).toFixed(0);
				document.getElementById("CoinTotalBlockMined").innerHTML = data.coin_total_block_mined;
				document.getElementById("CoinTotalBlockLeft").innerHTML = data.coin_total_block_left;
				document.getElementById("CoinCurrentNetworkDifficulty").innerHTML = data.coin_network_difficulty;
				document.getElementById("CoinCurrentNetworkHashrate").innerHTML = formatHashrate(data.coin_network_hashrate);


				document.getElementById("CoinInPending").innerHTML = totalCoinInPending + " " + data.coin_min_name;

			}
		}
		xmlHttp.open("GET", apiHost + "get_coin_network_full_stats", true); // async
		xmlHttp.send();
	}
	

	urls = ['https://cdn.xenophyte.com/bootstrap.min.js','https://cdn.xenophyte.com/vendor/jquery/jquery-3.6.1.min.js'];

	loadScripts(urls, urls.length, function()
	{
		Countdown();
		EnableCountdown();
		GetCoinNetworkInformation();
		setInterval(GetCoinNetworkInformation, 5000);
	});

	function formatHashrate(input)
	{
		var result = parseFloat(input);
		if (result < 1000)
		{
			return toFixedTrunc(parseFloat(result), 2) + " H/s";
		}
		else
		{
			if (result >= 1000 && result < 1000000) // KH
			{
				var result = (result/1000);
				return toFixedTrunc(parseFloat(result), 2) + " KH/s";
			}
			if (result >= 1000000 && result < 1000000000) // MH
			{
				var result = (result/1000000);
				return toFixedTrunc(parseFloat(result), 2) + " MH/s";
			}
			if (result >= 1000000000 && result < 1000000000000) // GH
			{
				var result = (result/1000000000);
				return toFixedTrunc(parseFloat(result), 2) + " GH/s";
			}
			if (result >= 1000000000000 && result < 1000000000000000) // TH
			{
				var result = (result/1000000000);
				return toFixedTrunc(parseFloat(result), 2) + " TH/s";
			}
			if (result >= 1000000000000000)
			{
				var result = (result/1000000000);
				return toFixedTrunc(parseFloat(result), 2) + " PH/s";
			}
		}
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


	var countdownInterval;

	function EnableCountdown()
	{
		countdownInterval = setInterval(function()
		{
			Countdown();
		}, 1000);
	}

	function Countdown()
	{
		var countDownDate = 1559340000;
		var now = Math.floor(Date.now() / 1000);

		var distanceNormal = countDownDate - now;
		var distance = distanceNormal * 1000;
  		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			

		if (distanceNormal < 0)
		{
			clearInterval(countdownInterval);
			//document.getElementById("Countdown").innerHTML = "Released";
			//document.getElementById("NetworkPhase").innerHTML = "Main Network";
			//document.getElementById("network").style = "display:none";
		}
		else
		{
  			document.getElementById("Countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
			document.getElementById("NetworkPhase").innerHTML = "Test Phase";
		}
	}

	