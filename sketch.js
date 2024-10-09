let html5QrCode;

function setup() {
    createCanvas(600, 400);
    const reader = document.getElementById('reader');
    html5QrCode = new Html5Qrcode(reader);

    // Start the QR Code scanner
    startScanner();
}

function startScanner() {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
        .catch(err => {
            console.error("Error starting scanner:", err);
        });
}

function onScanSuccess(decodedText) {
    console.log(`Code matched: ${decodedText}`);
    
    // Stop scanning
    html5QrCode.stop().then(() => {
        console.log("QR Code scanning stopped.");
        checkEntry(decodedText);
    }).catch(err => {
        console.error("Error stopping the scanner:", err);
    });
}

function checkEntry(code) {
    const dbRef = firebase.database().ref('users/' + code); // Update with your database path

    dbRef.once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                document.getElementById('result').innerText = 'Person found: ' + JSON.stringify(snapshot.val());
            } else {
                document.getElementById('result').innerText = 'Person not found';
            }
        })
        .catch(error => {
            console.error("Error checking entry:", error);
        });
}
