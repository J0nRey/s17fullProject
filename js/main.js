/*
{
    name:"...And Justice for All",
    band:"Metallica",
    gender:"Metal"
}
*/

const getAlbumData = () => {

    let albumObject = {}

    let fields = document.querySelectorAll("form input[type='text']")

/*     let selects = document.querySelectorAll("form select")
    console.log("selects", selects) */

    //console.log(fields)

    fields.forEach( field => {
        console.log(field.name)
        albumObject[field.name] = field.value
        console.log(albumObject)
    })

//  let gender = document.getElementById("gender").value //no necesitas las dos lineas de abajo
    let select = document.getElementById("gender")
    let gender = select.options[select.selectedIndex].value

    //console.log(gender)

    albumObject = { ...albumObject, gender }        //albunObject
//  equivale a --> albumObject,gender = gender
    console.log(albumObject)
    saveAlbum(albumObject) //mandamo a llamar la funcion SaveAlbum (que vamos a guardar)


    fields.forEach( field => { //borramos los datos del forulario
        field.value = ""
    })

}
//getAlbumData()

document.getElementById("save-album").addEventListener("click", getAlbumData)

const saveAlbum = album => {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        console.log("Objeto[llave]",xhttp.response)
        $('#save-succesful').modal('show')       //modal

        printTable( getAlbumsCollection() )

        }
    }
    xhttp.open("POST", "https://ajaxclass-1ca34-91895-default-rtdb.firebaseio.com/11g/jonathan/albums.json", true); //donde la vamos a guardar

    xhttp.send( JSON.stringify(album));
}


const getAlbumsCollection = () => {

    // Variable Global
    let albumsCollection;


    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.response)
            albumsCollection =  JSON.parse(xhttp.response)
         //console.log("Objeto[llave]",xhttp.response)
         //albumsCollection = xhttp.response.Text
        }
    }
    xhttp.open("GET", "https://ajaxclass-1ca34-91895-default-rtdb.firebaseio.com/11g/jonathan/albums.json", false); //donde la vamos a guardar, sincrono

    xhttp.send();

/*     setTimeout(function(){ //Es una funcion que me permite agregarle un delay a algo, en el tiempo de 1s
        console.log(albumsCollection)
    },1000) */

    //console.log(albumsCollection)

    return albumsCollection
}


const deleteAlbum = event => {      // Delete-Album
    console.log( event.target )

    let albumKey = event.target.dataset.albumKey
    console.log(albumKey)



    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.response)

            printTable(getAlbumsCollection())

        }
    }
    xhttp.open("DELETE", `https://ajaxclass-1ca34-91895-default-rtdb.firebaseio.com/11g/jonathan/albums/${albumKey}/.json`, false); //donde la vamos a guardar, sincrono

    xhttp.send();




}



const printTable = dataToPrint => {
    console.log(dataToPrint)
 //   console.log(Object.values( dataToPrint ))
    
    let table = document.getElementById("albums-table")

    let index = 1 // contador para nuestro index (almoadilla #)

    //limpiamos la tabla
    while (table.lastElementChild){
        table.removeChild(table.lastElementChild);
    }

   for(key in dataToPrint){
       console.log(key)
       console.log(dataToPrint[key])

       let { name, gender, band} = dataToPrint[key]

        let albumRow = document.createElement("tr")

        let indexTd = document.createElement("td")
        let nameTd = document.createElement("td")
        let bandTd = document.createElement("td")
        let genderTd = document.createElement("td")

        let buttonTd = document.createElement("td")


        let indexText = document.createTextNode( index )
        let nameText = document.createTextNode( name )
        let bandText = document.createTextNode( band )
        let genderText = document.createTextNode( gender )

        let deleteButton = document.createElement( "button" ) // Delete button
        deleteButton.classList = "btn btn-danger delete-button"  // creamos la propiedad class="btn btn-danger"

/*         deleteButton.classList.add("btn-outline-danger")
        deleteButton.classList.remove("btn-danger") */

        deleteButton.dataset.albumKey = key


        let buttonText = document.createTextNode( "Borrar" ) // Delete button

        deleteButton.appendChild( buttonText )

        indexTd.appendChild( indexText )
        nameTd.appendChild( nameText )
        bandTd.appendChild( bandText )
        genderTd.appendChild( genderText )

        buttonTd.appendChild( deleteButton ) // Delete button

        albumRow.appendChild( indexTd )
        albumRow.appendChild( nameTd )
        albumRow.appendChild( bandTd )
        albumRow.appendChild( genderTd )
        albumRow.appendChild( buttonTd )

        table.appendChild(albumRow)

        index++
        
   } 

   let buttons = document.querySelectorAll(".delete-button")

    buttons.forEach( button => {
       button.addEventListener("click", deleteAlbum)
    })
}

printTable( getAlbumsCollection() )



