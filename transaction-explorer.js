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
	var totalTransaction = 0;
	var pageTransaction = 1;
	var maxTransaction = 10;
	var transaction = [];
	var inUpdating = false;

	function GetCoinNetworkInformation()
	{
		if (!inUpdating)
		{
			inUpdating = true;
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function()
			{ 
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				{
					var data = JSON.parse(xmlHttp.responseText);
					document.getElementById("TotalTransactionXenophyte").innerHTML = data.coin_total_transaction;
					if (totalTransaction == 0)
					{
						totalTransaction = data.coin_total_transaction;
						if (transaction.length == 0)
						{
							var totalRound = 0;
							for(var i = totalTransaction; i > 0; i--)
							{
								if (totalRound < maxTransaction)
								{
									totalRound++;
									waitTransaction(i);
								}
							}
						}
					}
					else
					{
						if (totalTransaction < data.coin_total_transaction)
						{
							for (var i = totalTransaction; i <= data.coin_total_transaction; i++)
							{
								waitNewTransaction(i);
							}
						}
						totalTransaction = data.coin_total_transaction;
					}
				}
				inUpdating = false;
			}
			xmlHttp.open("GET", apiHost + "get_coin_network_full_stats", true); // async
			xmlHttp.send();
		}
	}
	
	async function waitTransaction(transactionId)
	{
		return await new Promise(r => GetCoinTransactionPerId(transactionId));
	}

	async function waitNewTransaction(transactionId)
	{
		return await new Promise(r => GetCoinNewTransactionPerId(transactionId));
	}


	function AskMoreTransaction()
	{
		if (transaction.length < (maxTransaction * pageTransaction))
		{
			if ((maxTransaction * pageTransaction) <= totalTransaction)
			{
				var start = totalTransaction - (maxTransaction * (pageTransaction-1));
				var difference = totalTransaction - (maxTransaction * pageTransaction);
				for(var i = start ; i > difference; i--)
				{
					if (i > 0)
					{
						GetCoinTransactionPerId(i);
					}
				}
			}
			else
			{
				var start = totalTransaction - transaction.length;
				if (start > 0)
				{
					for(var i = start; i > 0; i--)
					{
						if (i > 0)
						{
							GetCoinTransactionPerId(i);
						}
					}
				}
				else
				{
					pageTransaction--;
				}
			}
		}
		else
		{
			pageTransaction--;
		}
	}

	async function GetCoinTransactionPerId(transactionId)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.timeout = 10 * 1000;
		xmlHttp.onreadystatechange = function(e)
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data = JSON.parse(xmlHttp.responseText);
				if (transaction.indexOf(data.transaction_id) == -1)
				{
					transaction.push(data.transaction_id);
					var rowTransaction = document.createElement('tr');
					rowTransaction.setAttribute('data-json', data);

					var type = "Unknown";
					var amount = "Hidden";
					var fee = "Hidden";
					if (data.transaction_id_sender == "m")
					{
						type = "Blockchain";
						if (CheckBlockFeeUpdate(data.transaction_timestamp_sended))
						{
							amount = parseFloat(9.5).toFixed(8);
							fee = parseFloat(0.5).toFixed(8);
						}
						else
						{
							amount = parseFloat(10).toFixed(8);
							fee = parseFloat(0).toFixed(8);
						}
					}
					else if (data.transaction_id_sender == "f")
					{
						type = "Dev Fee or Testers Fee";
					}
					else if (data.transaction_id_sender == "r")
					{
						type = "RemoteNode Fee";
					}					
					else
					{
						type = "Wallet";
					}

					var rowTransactionContent = '<td>' + data.transaction_id + '</td>' +
						'<td>' + type + '</td>' +
					 	'<td>' + amount + '</td>' +
					 	'<td>' + fee + '</td>' +
						'<td>' + data.transaction_wallet_address_sender + '</td>' +
						'<td>' + data.transaction_wallet_address_receiver + '</td>' +
						'<td>' + formatDate(data.transaction_timestamp_sended) + '</td>' +
						'<td>' + formatDate(data.transaction_timestamp_received) + '</td>' +
						'<td onclick=\"CopyTransactionHash(\'' + data.transaction_hash +'\')\" class=\"text-primary\"><p>' + data.transaction_hash + '</p><div class="alert alert-info" role="alert" id=\'' + data.transaction_hash +'\' style=\"display:none\">transaction hash copied !</div></td>';

					rowTransaction.innerHTML = rowTransactionContent;
					var transactionList = $('#XenophyteListTransactionRows');
					transactionList.append(rowTransaction);
					previousSorting = "asc";
					sortTable(0);
				}
			}
		}
		xmlHttp.open("GET", apiHost + "get_coin_transaction_per_id=" + transactionId, true); // async
		xmlHttp.send();
	}

	function CopyTransactionHash(transactionHash)
	{
		var el = document.createElement('textarea');
   		el.value = transactionHash;
		el.setAttribute('readonly', '');
   		el.style = {position: 'absolute', left: '-9999px'};
		document.body.appendChild(el);
   		el.select();
   		document.execCommand('copy');
		document.body.removeChild(el);
		document.getElementById(transactionHash).style="display:visible";
		GetCoinTransactionPerHash(transactionHash);
		setTimeout(function()
		{
			document.getElementById(transactionHash).style="display:none";
		}, 500);
	}

	function GetCoinTransactionPerHash(transactionHash)
	{
		
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data = JSON.parse(xmlHttp.responseText);

					var type = "Unknown";
					var amount = "Hidden";
					var fee = "Hidden";
					if (data.transaction_id_sender == "m")
					{
						type = "Blockchain";
						if (CheckBlockFeeUpdate(data.transaction_timestamp_sended))
						{
							amount = parseFloat(9.5).toFixed(8);
							fee = parseFloat(0.5).toFixed(8);
						}
						else
						{
							amount = parseFloat(10).toFixed(8);
							fee = parseFloat(0).toFixed(8);
						}
					}
					else if (data.transaction_id_sender == "f")
					{
						type = "Dev Fee or Testers Fee";
					}
					else if (data.transaction_id_sender == "r")
					{
						type = "RemoteNode Fee";
					}					
					else
					{
						type = "Wallet";
					}

					document.getElementById("transactionId").innerHTML = data.transaction_id;
					document.getElementById("transactionType").innerHTML = type;
					document.getElementById("transactionAmount").innerHTML = amount;
					document.getElementById("transactionFee").innerHTML = fee;
					document.getElementById("transactionWalletAddressSender").innerHTML = data.transaction_wallet_address_sender;
					document.getElementById("transactionWalletAddressReceiver").innerHTML = data.transaction_wallet_address_receiver;
					document.getElementById("transactionDateSent").innerHTML = formatDate(data.transaction_timestamp_sended);
					document.getElementById("transactionDateReceived").innerHTML = formatDate(data.transaction_timestamp_received);
					document.getElementById("transactionHash").innerHTML = data.transaction_hash;
					document.getElementById("transactionQRCode").innerHTML = "";
					jQuery(function()
					{
						jQuery('#transactionQRCode').qrcode(data.transaction_hash);
					});
					document.getElementById("XenophyteTransactionResearchResult").style="display:visible";
        				$('html, body').animate({ scrollTop: $('#XenophyteTransactionResearchResult').offset().top }, 'slow');
			}
		}
		xmlHttp.open("GET", apiHost + "get_coin_transaction_per_hash=" + transactionHash, true); // async
		xmlHttp.send();
	}


	async function GetCoinNewTransactionPerId(transactionId)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function()
		{ 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				var data = JSON.parse(xmlHttp.responseText);
				if (transaction.indexOf(data.transaction_id) == -1)
				{
					transaction.push(data.transaction_id);
					var rowTransaction = document.createElement('tr');
					rowTransaction.setAttribute('data-json', data);

					var type = "Unknown";
					var amount = "Hidden";
					var fee = "Hidden";
					if (data.transaction_id_sender == "m")
					{
						type = "Blockchain";
						if (CheckBlockFeeUpdate(data.transaction_timestamp_sended))
						{
							amount = parseFloat(9.5).toFixed(8);
							fee = parseFloat(0.5).toFixed(8);
						}
						else
						{
							amount = parseFloat(10).toFixed(8);
							fee = parseFloat(0).toFixed(8);
						}
					}
					else if (data.transaction_id_sender == "f")
					{
						type = "Dev Fee or Testers Fee";
					}
					else if (data.transaction_id_sender == "r")
					{
						type = "RemoteNode Fee";
					}					
					else
					{
						type = "Wallet";
					}
					var rowTransactionContent = '<td>' + data.transaction_id + '</td>' +
							'<td>' + type + '</td>' +
					 		'<td>' + amount + '</td>' +
					 		'<td>' + fee + '</td>' +
							'<td>' + data.transaction_wallet_address_sender + '</td>' +
							'<td>' + data.transaction_wallet_address_receiver + '</td>' +
							'<td>' + formatDate(data.transaction_timestamp_sended) + '</td>' +
							'<td>' + formatDate(data.transaction_timestamp_received) + '</td>' +
							'<td onclick=\"CopyTransactionHash(\'' + data.transaction_hash +'\')\" class=\"text-primary\"><p>' + data.transaction_hash + '</p><div class="alert alert-info" role="alert" id=\'' + data.transaction_hash +'\' style=\"display:none\">transaction hash copied !</div></td>';
	
					var transactionList = document.getElementById("XenophyteListTransactionRows");
					var rowInsert = transactionList.insertRow(0);
					rowInsert.innerHTML = rowTransactionContent;
					rowInsert.appendChild(rowTransaction);
					previousSorting = "asc";
					sortTable(0);
				}
			}
		}
		xmlHttp.open("GET", apiHost + "get_coin_transaction_per_id=" + transactionId, true); // async
		xmlHttp.send();
	}


//-------------------------------------------------------------------------------------//
// Other functions

	function formatHashrate(input)
	{
		var result = parseFloat(input);
		if (result < 1024)
		{
			return result + " H/s";
		}
		else
		{
			if (result >= 1024 && result < 102400) // KH
			{
				var result = (result/1024);
				return parseFloat(result).toFixed(2) + " KH/s";
			}
			if (result >= 102400 && result < 10240000) // MH
			{
				var result = (result/102400);
				return parseFloat(result).toFixed(2) + " MH/s";
			}
			if (result >= 10240000 && result < 1024000000) // GH
			{
				var result = (result/10240000);
				return parseFloat(result).toFixed(2) + " GH/s";
			}
		}
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
	}

	function CheckBlockFeeUpdate(dateTransaction) 
	{
		if (dateTransaction >= 1565379210) // Implement block fee 
		{
			return true;
		}
		return false;
	}

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

	var oldSortingTable = 0;

	var previousSorting = "desc";

	function sortTable(n) {
		oldSortingTable = n;
		var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		table = document.getElementById("transactionTable");
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


	urls = ['https://cdn.xenophyte.com/bootstrap.min.js', 'https://cdn.xenophyte.com/jquery.qrcode.min.js', 'https://cdn.xenophyte.com/vendor/jquery/jquery-3.6.1.min.js'];

	loadScripts(urls, urls.length, function()
	{
		document.getElementById("XenophyteTransactionResearchResult").style = "display:none";

		GetCoinNetworkInformation();

		setInterval(async function()
		{
			await GetCoinNetworkInformation();
		}, 5000);

		$("#showXenophyteMoreTransaction").click(function()
		{
			pageTransaction++;
			AskMoreTransaction();
		});

		$("#searchXenophyteTransactionPerHash").click(function()
		{
			var transactionHash = $("#transactionHashSearched").val().trim();
			if (!transactionHash)
			{
				$("transactionHashSearched").focus();
			}
			else
			{
				GetCoinTransactionPerHash(transactionHash);
			}
		});

		$("#transactionHashSearched").keyup(function(e)
		{
			if (e.keyCode === 13)
				$("#searchXenophyteTransactionPerHash").click();
		});
		if(window.location.href.indexOf("#") != -1)
		{
			GetCoinTransactionPerHash(window.location.href.split('#')[1]);
		}
	});
