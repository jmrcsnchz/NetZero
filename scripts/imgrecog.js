const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const webcam = new Webcam(webcamElement, 'user', canvasElement);

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function apiUpload(image) {
    xhr = new XMLHttpRequest;
    fd = new FormData();
    fd.append('file', image);
    xhr.open('POST', 'https://api.spoonacular.com/food/images/analyze?apiKey=4670a21c1b634271ad14078b7fbab641', true);
    xhr.onload = function() {
        if (xhr.readyState == xhr.DONE) {
            if (xhr.status == 200) {
                //console.log(xhr.response)
                printfoodinfo(xhr.response);
            }
            else {
                document.getElementById("result").innerHTML = '<pre>API Error. Please Contact Enertech</pre>';
            }
            
        }
    };
    xhr.send(fd);
};

webcam.start()
.then(result =>{
    console.log("webcam started");
})
.catch(err => {
    alert(err + '\r\n\r\nInvalid Camera or Camera is currently used by other apps');
});

function capture(){
    
    let picture = webcam.snap();
    webcam.snap();
    var block = picture.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    var blob = b64toBlob(realData, contentType);
    apiUpload(blob);
};

function cameraflip(){
    webcam.flip();
    webcam.start();
};

function printfoodinfo(jsoninfo){
    foodinfo = JSON.parse(jsoninfo);
    foodname = foodinfo.category.name;
    nutri = foodinfo.nutrition;
    calories = nutri.calories.value + nutri.calories.unit;
    fat = nutri.fat.value + nutri.fat.unit;
    protein = nutri.protein.value + nutri.protein.unit;
    carbs = nutri.carbs.value + nutri.carbs.unit;

    document.getElementById("result").innerHTML = `<h1>${foodname}</h1><br>
                <b>Calories:</b> ${calories}<br>
                <b>Fat:</b> ${fat}<br>
                <b>Protein:</b> ${protein}<br>
                <b>Carbhohydrates:</b> ${carbs}<br>
                    `;
};