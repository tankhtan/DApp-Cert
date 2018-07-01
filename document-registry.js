$(document).ready(function () {
  
    const documentRegistryContractAddress = "0x8ddff69057f5bcf723c2c49e7255245903df3a5d";
    const documentRegistryContractABI = 
    [
	{
	    "constant": false,
	    "inputs": [
			{
			    "name": "hash",
			    "type": "string"
			}
	    ],
	    "name": "add",
	    "outputs": [
			{
			    "name": "dateAdded",
			    "type": "uint256"
			}
	    ],
	    "payable": false,
	    "stateMutability": "nonpayable",
	    "type": "function"
	},
	{
	    "constant": false,
	    "inputs": [
			{
			    "name": "name",
			    "type": "string"
			},
			{
			    "name": "id",
			    "type": "string"
			},
			{
			    "name": "activity",
			    "type": "string"
			},
			{
			    "name": "role",
			    "type": "string"
			}
	    ],
	    "name": "createRecord",
	    "outputs": [],
	    "payable": false,
	    "stateMutability": "nonpayable",
	    "type": "function"
	},
	{
	    "inputs": [],
	    "payable": false,
	    "stateMutability": "nonpayable",
	    "type": "constructor"
	},
	{
	    "constant": true,
	    "inputs": [
			{
			    "name": "index",
			    "type": "uint256"
			}
	    ],
	    "name": "getDocument",
	    "outputs": [
			{
			    "name": "",
			    "type": "string"
			},
			{
			    "name": "",
			    "type": "uint256"
			}
	    ],
	    "payable": false,
	    "stateMutability": "view",
	    "type": "function"
	},
	{
	    "constant": true,
	    "inputs": [],
	    "name": "getDocumentsCount",
	    "outputs": [
			{
			    "name": "length",
			    "type": "uint256"
			}
	    ],
	    "payable": false,
	    "stateMutability": "view",
	    "type": "function"
	},
	{
	    "constant": true,
	    "inputs": [
			{
			    "name": "index",
			    "type": "uint256"
			}
	    ],
	    "name": "getStudent",
	    "outputs": [
			{
			    "name": "",
			    "type": "string"
			},
			{
			    "name": "",
			    "type": "string"
			},
			{
			    "name": "",
			    "type": "string"
			},
			{
			    "name": "",
			    "type": "string"
			},
			{
			    "name": "",
			    "type": "uint256"
			}
	    ],
	    "payable": false,
	    "stateMutability": "view",
	    "type": "function"
	},
	{
	    "constant": true,
	    "inputs": [],
	    "name": "getStudentsCount",
	    "outputs": [
			{
			    "name": "length",
			    "type": "uint256"
			}
	    ],
	    "payable": false,
	    "stateMutability": "view",
	    "type": "function"
	}
      ];
  
  const IPFS = window.IpfsApi('localhost', '5001');
  //TKH
  //const Buffer = ipfs.Buffer;
  const Buffer = IPFS.Buffer;

$('#linkHome').click(function () {
    showView("viewHome")
});
$('#linkCreateRecord').click(function () {
    showView("viewCreateRecord")
});
$('#linkGetRecords').click(function () {
    $('#viewGetRecords div').remove();
    showView("viewGetRecords");
    viewGetRecords();
});
$('#linkSubmitDocument').click(function () {
    showView("viewSubmitDocument")
});
$('#linkGetDocuments').click(function () {
    $('#viewGetDocuments div').remove();
    showView("viewGetDocuments");
    viewGetDocuments();
});
$('#documentUploadButton').click(uploadDocument);

$('#createRecordButton').click(createRecord);

// Attach AJAX "loading" event listener
$(document).on({
    ajaxStart: function () {
        $("#loadingBox").show()
    },
    ajaxStop: function () {
        $("#loadingBox").hide()
    }
});

function showView(viewName) {
    // Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();
}

function showInfo(message) {
$('#infoBox>p').html(message);
    $('#infoBox').show();
    $('#infoBox>header').click(function () {
        $('#infoBox').hide();
    });
}

function showError(errorMsg) {
    $('#errorBox>p').html("Error: " + errorMsg);
    $('#errorBox').show();
    $('#errorBox>header').click(function () {
        $('#errorBox').hide();
    });
}

function uploadDocument() {
  if($('#documentForUpload')[0].files.length === 0) {
    return showError("Please select a file to upload.");
  }
  let fileReader = new FileReader();
  fileReader.onload = function () {
    if (typeof web3 === 'undefined')
      return showError("Please install MetaMask to access Ethereum Web3 API from browser");
    let fileBuffer = Buffer.from(fileReader.result);
    let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
    IPFS.files.add(fileBuffer, (err, result) => {
      if (err) {
          return showError(err);
      }
      if (result) {
        let ipfsHash = result[0].hash;
        alert(ipfsHash);
        contract.add(ipfsHash, function(err,txHash) {
            if (err) {
                return showError(err);
            }
            
          showInfo(`Document ${ipfsHash} <b>successfully added</b> to the registry. Txn hash: ${txHash}`);
        })        
      }
    })
  };
  fileReader.readAsArrayBuffer($('#documentForUpload')[0].files[0]);
}

function createRecord() {
    if (typeof web3 === 'undefined')
        return showError("Please install MetaMask to access Ethereum Web3 API from browser");
    let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
    var name = document.getElementById("student_name").value;
    var id = document.getElementById("student_id").value;
    var activity = document.getElementById("activity").value;
    var role = document.getElementById("role").value;
    var date = document.getElementById("date").value;
    contract.createRecord(name,id,activity,role, function (err, txHash) {
        if (err) {
            return showError(err);
        }
        showInfo(`Record <b>successfully added</b> to the registry. Txn hash: ${txHash}`);
    })
}

function viewGetDocuments() {
  if (typeof web3 === 'undefined')
    return showError("Please install MetaMask to access Ethereum Web3 API from browser");

  let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
  contract.getDocumentsCount(function(err, result) {
    if (err)
      return showError("Smart contract call failed: " + err);
    
    let documentsCount = result.toNumber();
    if (documentsCount > 0) {
      let html = $('<div>');
      for (let i = 0; i < documentsCount; i++) {
        contract.getDocument(i, function(err, result) {
          if (err)
            return showError("Smart contract call failed: " + err);
          let ipfsHash = result[0];
          let contractPublishDate = result[1];
          let div = $('<div class="resp-container">');
          let url = "https://ipfs.io/ipfs/" + ipfsHash;
          let displayDate = new Date(contractPublishDate * 1000).toLocaleString();
          div
            .append($(`<p>Document published on: ${displayDate}</p>`))
            .append($(`<iframe class="resp-iframe" src="${url}"></iframe>`));
            html.append(div);
        })
      }
      html.append('</div>');
      $('#viewGetDocuments').append(html);
    }
    else {
      $('#viewGetDocuments').append('<div>No documents in the document registry.</div>');
    }
  });
}

function viewGetRecords() {
    if (typeof web3 === 'undefined')
        return showError("Please install MetaMask to access Ethereum Web3 API from browser");
    let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
    contract.getStudentsCount(function (err, result) {
        if (err)
            return showError("Smart contract call failed::: " + err);

        let studentsCount = result.toNumber();
        if (studentsCount > 0) {
            let html = $('<div>');
            for (let i = 0; i < studentsCount; i++) {
                contract.getStudent(i, function (err, result) {
                    if (err)
                        return showError("Smart contract call failed: " + err);

                    let name = result[0];
                    let id = result[1];
                    let activity = result[2];
                    let role = result[3];
                    let contractPublishDate = result[4];
                    let displayDate = new Date(contractPublishDate * 1000).toLocaleString();
                    let div = $('<div>');
                    div
                      .append($(`<p>Student name: ${name}</p>`))
                      .append($(`<p>Student id: ${id}</p>`))
                      .append($(`<p>Activity: ${activity}</p>`))
                      .append($(`<p>Role: ${role}</p>`))
                      .append($(`<p>Recorded on: ${displayDate}</p>`));
                    html.append(div);
                })
            }
            html.append('</div>');
            $('#viewGetRecords').append(html);
        }
        else {
            $('#viewGetRecords').append('<div>No students in the co-curricular activity registry.</div>');
        }
    });
}


});





