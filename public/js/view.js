$(document).ready(function () {

    loadAll()
    //posting ride
    $(document).on("click", "#postBtn", function () {

        var data = {
            name: $("#name").val(),
            pin: $("#pin").val(),
            departure: $("#departure").val(),
            destination: $("#destination").val(),
            date: $("#date").val(),
            time: $("#time").find(":selected").text(),
            currentSeats: 0,
            seats: $("#seats").find(":selected").text(),
            minMoney: $("#minumum").val()
        };

        console.log(data)

        $.post("/api/postRide", data)

        $("#addDiv").css("display", "none")
        loadAll()

    })


    //join ride
    $(document).on("click", "#joinBtn",function(){
        $("#blackoutDiv").css("display","none");
        $("#joinDiv").css("display","none");
        var targetId = $(this).parent().parent().attr("value");
        console.log(targetId)

        var data ={
            name: $("#joinName").val(),
            pin: $("#joinPin").val(),
            phone:$("#joinPhone").val(),
            email:$("#joinEmail").val(),
            memo:$("#joinMemo").val(),
            postid: targetId
        }        

        console.log(data)

        $.post("/api/joinRide",data).then(function(){
            $("#joinName").val("");
            $("#joinPhone").val("");
            $("#joinEmail").val("");
            $("#joinMemo").val(""); 
        })

        $.get("/api/ids/"+targetId, function (data){
            // console.log(data[0])
            console.log(`updating target id:${data[0].id}`);
            var addSeat = data[0].currentSeats+1
            console.log(`new seat is ${addSeat}`)
            var updatedSeat = {
                id:data[0].id,
                currentSeats: addSeat
            };
            
            if (addSeat >= data[0].seats){
                console.log("Seat reached max seat");
                var targetBtn = `#`+targetId;
                console.log(targetBtn)
                $(targetBtn).attr("value","disabled")
            }

            console.log(updatedSeat);

            $.ajax({
                method: "PUT",
                url: "/api/update",
                data: updatedSeat,
                success: function(response){
                    if(response.success){
                        alert(`Joined!`)
                    }
                    else{
                        alert(`Seat is full! Please refresh the page.`)
                    }
                   }
            })
            
        })
        
    })

    //join button inside the table
    $(document).on("click",".joinBtn", function(){
        $("#blackoutDiv").css("display","block");
        $("#joinDiv").css("display","block");
        // console.log(`${$(this).attr("id")}`)
        $("#joinDiv").attr("value",`${$(this).attr("id")}`);

    })

    //show Riders in post
    var showId = ``;
    $(document).on("click", ".showRiders",function(){
        window.scrollTo(0, 0);
        $("#ridersDiv").empty()
        $("#ridersDiv").append(`
        <h3>Type your post pin number</h3>
        <p>Pin: <input maxlength="4" type="password" id="postPin"></p>
        <p><button id="postPinBtn">Submit</button></p>
        <button id="closeBtn">X</button>
        `)
        // console.log(`${$(this).attr("value")} is id`)
        $("#blackoutDiv").css("display","block");
        $("#ridersDiv").css("display","block");
        showId = $(this).attr("value");
        console.log(`showId is set: ${showId}`)
    })


    $(document).on("click", "#postPinBtn",function(){
        var pin = Number($("#postPin").val());

        $.get("/pin/"+showId, function (data) {
            console.log(`pin from server is ${data[0].pin}`)

            if (pin == data[0].pin){
                alert("pin matched, riders will be displayed")
                displayRiders(showId)
                showId = ``;
                console.log(`showId is: cleared ${showId}`)                
            }
            else{
                alert("pin not matching, please try again")
            }
        })      
    })


    function displayRiders(showId){
        console.log(`displayRiders with id ${showId}`)
        $("#ridersDiv").empty();
        
        $.get("/user/"+showId, function (data) {
            console.log(data)
        var table =
            `<table>
            <tr>
                <th>Name</th>                
                <th>Phone</th>
                <th>Email</th>
                <th>Memo</th>        
            </tr>`

        for (var i = (data.length-1); i >= 0; i--) {

            var dis = ``;
            var joinText = `Join`;
            
            var contents =
                `<tr>
                <td> ${data[i].name} </td>
                <td> ${data[i].phone} </td>
                <td> ${data[i].email} </td>
                <td> ${data[i].memo} </td>   
                </tr>`

            table += contents
        }

        table += `</table><button id="closeBtn">X</button>`

        $("#ridersDiv").append(table)
    })
}

    //clear the default value of inputbox when click.

    $(document).on("click", ".inputValue", function () {

        $(this).val("");
    })

    //close button for the modal in general
    $(document).on("click", "#closeBtn", function () {

        var target=`#${$(this).parent().attr("id")}`;
        console.log(target)

        $(target).css("display", "none");
        showId = ``;
        console.log(`showId is: cleared ${showId}`)
        $("#blackoutDiv").css("display","none");
        loadAll()
    })

    //post ride button from the nav bar

    $(document).on("click", "#postRide", function () {
        $("#listDiv").empty()
        $("#blackoutDiv").css("display","block");
        $("#addDiv").css("display", "block")
    })

    //get ride button from the nav bar
    $(document).on("click", "#fullTable", function () {
        $("#addDiv").css("display", "none")
        loadAll()
    })


    //search by school button from the nav bar
    $(document).on("click", "#searchBtn", function () {
        var searchTerm = `/api/all/${$("#searchTerm").val()}`;
        console.log(searchTerm)
        loadBySchool(searchTerm);
    })

    //search by school function

    function loadBySchool(searchTerm){        
        
        $.get(searchTerm, function (data) {        
      
            refreshTable(data)
        })       

    }

    //refreshing table (front end side)

    function refreshTable(data) {
        // console.log(data)
        $("#listDiv").empty();
        $("#blackoutDiv").css("display","none");

        var table =
            `<table>
            <tr>
                <th>Name</th>                
                <th>Departure</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Time</th>
                <th>Number of Seats</th>
                <th>Minimum Pay</th>            
                <th>Join</th>              
            </tr>`

        for (var i = (data.length-1); i >= 0; i--) {

            var dis = `style="background-color:#CFEBF7"`;
            var joinText = `Join`;

            if (data[i].isFull){
                console.log(`${data[i].name}'s post is full`)
                dis = `disabled style="background-color:#FCE6FC"`
                joinText = `Full`
            }            
            
            var contents =
                `<tr>
                <td> ${data[i].name} </td>
                <td> ${data[i].departure} </td>
                <td> ${data[i].destination} </td>
                <td> ${data[i].date} </td>
                <td> ${data[i].time} </td>
                <td> ${data[i].currentSeats} / ${data[i].seats} <button class="showRiders" value="${data[i].id}">Show Riders</button></td>
                <td> ${data[i].minMoney} </td>
                <td><button class="joinBtn" ${dis} id="${data[i].id}">${joinText}</button></td>
            </tr>`

            table += contents
        }

        table += `</table>`

        $("#listDiv").append(table)
    }

 

    //requesting all database 
    function loadAll() {
        console.log("loading all")
        $.get("/api/all/", function (data) {

            refreshTable(data);

        })
    }

})
