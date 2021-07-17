const home = document.getElementById('home');
const scanlist = document.getElementById('scanmenu');
const scanner = document.getElementById('scanner');
const scanresult = document.getElementById('scanresult');
//const inventory = document.getElementById('inventory');
//const profile = document.getElementById('profile');


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
    apiKey = '4670a21c1b634271ad14078b7fbab641';
    xhr.open('POST', `https://api.spoonacular.com/food/images/analyze?apiKey=${apiKey}`, true);
    xhr.onload = function() {

        if (xhr.readyState == xhr.DONE) {
           document.getElementById('loading').style.display = 'none';  
            if (xhr.status == 200) {
                //console.log(xhr.response)
                
                printfoodinfo(xhr.response);
            }
            else {
                console.log('<h1>API Error. Please Contact Enertech</h1>');
            }
            
        }
    };
    xhr.send(fd);
};



function capture(){
    document.getElementById('loading').style.display = 'block';
    let picture = webcam.snap();
    document.getElementById('foodimg').src = picture;
    var block = picture.split(";");
    var contentType = block[0].split(":")[1];
    var realData = block[1].split(",")[1];
    var blob = b64toBlob(realData, contentType);
    apiUpload(blob);
    
};

function printfoodinfo(jsoninfo){
    foodinfo = JSON.parse(jsoninfo);
    foodname = foodinfo.category.name.replace('_',' ');
    nutri = foodinfo.nutrition;
    calories = nutri.calories.value + ' ' + nutri.calories.unit;
    fat = nutri.fat.value + ' ' + nutri.fat.unit;
    protein = nutri.protein.value + ' ' + nutri.protein.unit;
    carbs = nutri.carbs.value + ' ' + nutri.carbs.unit;

    document.getElementById('calories').innerHTML = calories;
    document.getElementById('fat').innerHTML = fat;
    document.getElementById('protein').innerHTML = protein;
    document.getElementById('carbs').innerHTML = carbs;


    console.log(jsoninfo);
    scanlist.style.display = 'none';
    scanner.style.display = 'none';
    scanresult.style.display = 'block';

   
    document.getElementById('foodname').innerHTML = foodname;

    /*document.getElementById("result").innerHTML = `<h1>${foodname}</h1><br>
                <b>Calories:</b> ${calories}<br>
                <b>Fat:</b> ${fat}<br>
                <b>Protein:</b> ${protein}<br>
                <b>Carbhohydrates:</b> ${carbs}<br>
                    `;*/
};

//pages here


function overviewinfo(){
    document.getElementById('nutriinfo').style.display = 'none';
    document.getElementById('overviewinfo').style.display = 'block';
};
function nutriinfo(){
    document.getElementById('overviewinfo').style.display = 'none';
    document.getElementById('nutriinfo').style.display = 'block';
};
