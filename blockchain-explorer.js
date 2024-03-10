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
	var totalBlockMined = 0;
	var pageBlock = 1;
	var maxBlock = 10;
	var blockMined = [];

	function GetCoinNetworkInformation()
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data = JSON.parse(xmlHttp.responseText);
				document.getElementById("TotalBlockMinedXenophyte").innerHTML = data.coin_total_block_mined;
				document.getElementById("TotalBlockLeftXenophyte").innerHTML = data.coin_total_block_left;
				document.getElementById("NetworkHashrateXenophyte").innerHTML = formatHashrate(data.coin_network_hashrate);
				document.getElementById("NetworkDifficultyXenophyte").innerHTML = data.coin_network_difficulty;
				if (totalBlockMined == 0)
				{
					totalBlockMined = data.coin_total_block_mined;
					if (blockMined.length == 0)
					{
						var totalRound = 0;
						for(var i = totalBlockMined; i > 0; i--)
						{
							if (totalRound < maxBlock)
							{
								totalRound++;
								GetCoinBlockPerId(i);
							}
						}
					}
				}
				else
				{
					
					if (totalBlockMined < data.coin_total_block_mined)
					{
						for (var i = totalBlockMined; i <= data.coin_total_block_mined; i++)
						{
							GetCoinNewBlockPerId(i);
						}
						totalBlockMined = data.coin_total_block_mined;
					}
				}
			}
		}
		xmlHttp.open("GET", apiHost + "get_coin_network_full_stats", true); // async
		xmlHttp.send();
	}
	
	function AskMoreBlock()
	{
		if (blockMined.length < (maxBlock * pageBlock))
		{
			if ((maxBlock * pageBlock) <= totalBlockMined)
			{
				var start = totalBlockMined - (maxBlock * (pageBlock-1));
				var difference = totalBlockMined - (maxBlock * pageBlock);
				for(var i = start ; i > difference; i--)
				{
					if (i > 0)
					{
						GetCoinBlockPerId(i);
					}
				}
			}
			else
			{
				var start = totalBlockMined - blockMined.length;
				if (start > 0)
				{
					for(var i = start; i > 0; i--)
					{
						if (i > 0)
						{
							GetCoinBlockPerId(i);
						}
					}
				}
				else
				{
					pageBlock--;
				}
			}
		}
		else
		{
			pageBlock--;
		}
	}

	function GetCoinBlockPerId(blockId)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data = JSON.parse(xmlHttp.responseText);
				if (blockMined.indexOf(data.block_id) == -1)
				{
					blockMined.push(data.block_id);
					var rowBlock = document.createElement('tr');
					rowBlock.setAttribute('data-json', data);
					if (CheckBlockFeeUpdate(data.block_timestamp_create)) // Implement block fee detail
					{
						var rowBlockContent = '<td>' + data.block_id + '</td>' +
							'<td onclick=\"CopyBlockHash(\'' + data.block_hash +'\')\" class=\"text-primary\"><p>' + data.block_hash + '</p><div class="alert alert-info" role="alert" id=\'' + data.block_hash +'\' style=\"display:none\">block hash copied !</div></td>' +
							'<td>' + data.block_difficulty + '</td>' +
							'<td>' + parseFloat(data.block_reward).toFixed(8) + ' - Dev Fee of ' + parseFloat(0.5).toFixed(8) + '</td>' +
							'<td>' + formatDate(data.block_timestamp_create) + '</td>' +
							'<td>' + formatDate(data.block_timestamp_found) + '</td>' +
					 		'<td><a href=\"transaction-explorer.html#' + data.block_transaction_hash + '\" target=\"_blank\">' + data.block_transaction_hash + '</a></td>';
						rowBlock.innerHTML = rowBlockContent;
					}
					else
					{
						var rowBlockContent = '<td>' + data.block_id + '</td>' +
							'<td onclick=\"CopyBlockHash(\'' + data.block_hash +'\')\" class=\"text-primary\"><p>' + data.block_hash + '</p><div class="alert alert-info" role="alert" id=\'' + data.block_hash +'\' style=\"display:none\">block hash copied !</div></td>' +
							'<td>' + data.block_difficulty + '</td>' +
							'<td>' + parseFloat(data.block_reward).toFixed(8) + '</td>' +
							'<td>' + formatDate(data.block_timestamp_create) + '</td>' +
							'<td>' + formatDate(data.block_timestamp_found) + '</td>' +
					 		'<td><a href=\"transaction-explorer.html#' + data.block_transaction_hash + '\" target=\"_blank\">' + data.block_transaction_hash + '</a></td>';
						rowBlock.innerHTML = rowBlockContent;
					}
					var blockList = $('#XenophyteListBlockMinedRows');
					blockList.append(rowBlock);
					previousSorting = "asc";
					sortTable(0);
				}
			}
		}
		xmlHttp.open("GET", apiHost + "get_coin_block_per_id=" + blockId, true); // async
		xmlHttp.send();
	}

	function CopyBlockHash(blockHash)
	{
		var el = document.createElement('textarea');
   		el.value = blockHash;
		el.setAttribute('readonly', '');
   		el.style = {position: 'absolute', left: '-9999px'};
		document.body.appendChild(el);
   		el.select();
   		document.execCommand('copy');
		document.body.removeChild(el);
		document.getElementById(blockHash).style="display:visible";
		GetCoinBlockPerHash(blockHash);
		setTimeout(function()
		{
			document.getElementById(blockHash).style="display:none";
		}, 500);
	}

	function GetCoinBlockPerHash(blockHash)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data = JSON.parse(xmlHttp.responseText);
				document.getElementById("blockHeight").innerHTML = data.block_id;
				document.getElementById("blockHash").innerHTML = data.block_hash;
				document.getElementById("blockDifficulty").innerHTML = data.block_difficulty;
				document.getElementById("blockReward").innerHTML = parseFloat(data.block_reward).toFixed(8);
				document.getElementById("blockDateCreated").innerHTML = formatDate(data.block_timestamp_create);
				document.getElementById("blockDateFound").innerHTML = formatDate(data.block_timestamp_found);
				document.getElementById("blockTransactionHash").innerHTML = data.block_transaction_hash;
				document.getElementById("blockTransactionHashUrl").href= "/transaction-explorer.html#"+data.block_transaction_hash;
				document.getElementById("XenophyteBlockResearchResult").style="display:visible";
				document.getElementById("blockQRCode").innerHTML = "";
				jQuery(function()
				{
						jQuery('#blockQRCode').qrcode(data.block_hash);
				});
        			$('html, body').animate({ scrollTop: $('#XenophyteBlockResearchResult').offset().top }, 'slow');
			}
		}
		xmlHttp.open("GET", apiHost + "get_coin_block_per_hash=" + blockHash, true); // async
		xmlHttp.send();
	}

	function GetCoinNewBlockPerId(blockId)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data = JSON.parse(xmlHttp.responseText);
				if (blockMined.indexOf(data.block_id) == -1)
				{
					blockMined.push(data.block_id);
					var rowBlock = document.createElement('tr');
					rowBlock.setAttribute('data-json', data);
					var rowBlockContent = '';
					if (CheckBlockFeeUpdate(data.block_timestamp_create)) // Implement block fee detail
					{
						var rowBlockContent = '<td>' + data.block_id + '</td>' +
							'<td onclick=\"CopyBlockHash(\'' + data.block_hash +'\')\" class=\"text-primary\"><p>' + data.block_hash + '</p><div class="alert alert-info" role="alert" id=\'' + data.block_hash +'\' style=\"display:none\">block hash copied !</div></td>' +
							'<td>' + data.block_difficulty + '</td>' +
							'<td>' + parseFloat(data.block_reward).toFixed(8) + ' - Dev Fee of ' + parseFloat(0.5).toFixed(8) + '</td>' +
							'<td>' + formatDate(data.block_timestamp_create) + '</td>' +
							'<td>' + formatDate(data.block_timestamp_found) + '</td>' +
					 		'<td><a href=\"transaction-explorer.html#' + data.block_transaction_hash + '\" target=\"_blank\">' + data.block_transaction_hash + '</a></td>';
					}
					else
					{
						var rowBlockContent = '<td>' + data.block_id + '</td>' +
							'<td onclick=\"CopyBlockHash(\'' + data.block_hash +'\')\" class=\"text-primary\"><p>' + data.block_hash + '</p><div class="alert alert-info" role="alert" id=\'' + data.block_hash +'\' style=\"display:none\">block hash copied !</div></td>' +
							'<td>' + data.block_difficulty + '</td>' +
							'<td>' + parseFloat(data.block_reward).toFixed(8) + '</td>' +
							'<td>' + formatDate(data.block_timestamp_create) + '</td>' +
							'<td>' + formatDate(data.block_timestamp_found) + '</td>' +
					 		'<td><a href=\"transaction-explorer.html#' + data.block_transaction_hash + '\" target=\"_blank\">' + data.block_transaction_hash + '</a></td>';
					}

					var blockList = document.getElementById("XenophyteListBlockMinedRows");
					var rowInsert = blockList.insertRow(0);
					rowInsert.innerHTML = rowBlockContent;
					rowInsert.appendChild(rowBlock);
					previousSorting = "asc";
					sortTable(0);
				}
			}
		}
		xmlHttp.open("GET", apiHost + "get_coin_block_per_id=" + blockId, true); // async
		xmlHttp.send();
	}


//-------------------------------------------------------------------------------------//
// Other functions

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

	function formatDateTime(input){
		var t = new Date(1970,0,1);
		t.setSeconds(input);
		var s = t.toTimeString().substr(0,8);
		if(input > 86399)
		{
			s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
		}
		return s;
	};

	function formatDate(time){
		if (!time) return '';
		return new Date(parseInt(time) * 1000).toLocaleString();
	}

	function GetTimeExpire()
	{
	 	var now = new Date();
  		var time = now.getTime();
  		var expireTime = time + 1000*60*5;
  		now.setTime(expireTime);
		return now;
	}

	function CheckBlockFeeUpdate(dateBlock) 
	{
		if (dateBlock >= 1565379210) // Implement block fee 
		{
			return true;
		}
		return false;
	}


	var previousSorting = "desc";

	function sortTable(n) {
		var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		table = document.getElementById("blockTable");
		switching = true;
		if (previousSorting == "asc")
		{
			dir = "desc"; 
			previousSorting = "desc";
		}
		else
		{
			dir = "asc";
			previousSorting = "asc";
		}
		while (switching) {
			switching = false;
			rows = table.rows;
		
			for (i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
		
			x = rows[i].getElementsByTagName("TD")[n];
			y = rows[i + 1].getElementsByTagName("TD")[n];
		
			if (dir == "asc") {
				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
				shouldSwitch = true;
				break;
				}
			} else if (dir == "desc") {
				if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
				shouldSwitch = true;
				break;
				}
			}
			}
			if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			switchcount ++; 
			} else {
			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
			}
		}
	}

	function CalculateMiningTimeFromBlocktemplate(hashrate)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data= JSON.parse(xmlHttp.responseText);
				var calculation = ((data.block_difficulty / (hashrate / data.block_lifetime)) / 3600) / 24;
				calculation = toFixedTrunc(calculation, 4);
				document.getElementById("calculationResult").innerHTML = calculation + " day(s)";
			}
		}
		xmlHttp.open("GET", apiHost + "get_last_blocktemplate", true); // async
		xmlHttp.send();
	}

	function CalculateMiningTime(hashrate, input)
	{
		if (hashrate <= 0)
		{
			input = false;
		}
		var unit = document.getElementById("XenophyteCalculation").value;
		if (input)
		{
			if (unit == "h")
			{
				hashrate = hashrate;
			}
			else if (unit == "kh")
			{
				hashrate = hashrate * 1000;
			}
			else if (unit == "mh")
			{
				hashrate = hashrate * 1000000;
			}
		
			CalculateMiningTimeFromBlocktemplate(hashrate);
		}
	}

	urls = ['https://cdn.xenophyte.com/bootstrap.min.js', 'https://cdn.xenophyte.com/jquery.qrcode.min.js', 'https://cdn.xenophyte.com/vendor/jquery/jquery-3.6.1.min.js'];

	loadScripts(urls, urls.length, function()
	{
 
		document.getElementById("XenophyteBlockResearchResult").style = "display:none";


		$("#showXenophyteMoreBlock").click(function()
		{
			pageBlock++;
			AskMoreBlock();
		});

		$("#searchXenophyteBlockPerHash").click(function()
		{
			var blockHash = $("#blockHashSearched").val().trim();
			if (!blockHash)
			{
				$("blockHashSearched").focus();
			}
			else
			{
				GetCoinBlockPerHash(blockHash);
			}
		});

		$("#blockHashSearched").keyup(function(e)
		{
			if (e.keyCode === 13)
				$("#searchXenophyteBlockPerHash").click();
		});

		if(window.location.href.indexOf("#") != -1)
		{
			GetCoinBlockPerHash(window.location.href.split('#')[1]);
		}


		$("#inputHashrateCalculator").keyup(function(e)
		{
			if (e.keyCode === 13)
				$("#buttonCalculateProfit").click();
		});


		$("#buttonCalculateProfit").click(function()
		{
			var hashrate = $("#inputHashrateCalculator").val().trim();
			if (!hashrate)
			{
				$("inputHashrateCalculator").focus();
			}

			CalculateMiningTime(hashrate, true);
		});
		GetCoinNetworkInformation();

		setInterval(GetCoinNetworkInformation, 5000);

	});
