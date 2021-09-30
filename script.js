$(function(){
    
    let allList = []
    
    let single_coin = {
        id: '',
        eur: '',
        usd: '',
        ils: '',
        time_stamp:'',
        thumb:''
    }
    
    let market_data_arr =[]
    updateJasonParse()
    function updateJasonParse() {        
        if (localStorage.l_c_market_data) {
            market_data_arr = JSON.parse(localStorage.l_c_market_data)  
        }
    }
    console.log("market_data_arr:");
    console.log(market_data_arr);
    // console.log(market_data_arr[1]["id"]);
    // console.log(market_data_arr[1]["time_stamp"]);
    
    let single_card = {
        id: '',
        symbol: '',
        name: '',
        is_favorite:''
    }
    let drawn_cards_arr  = []
    
    let temp5arr =[]

    let single_favorite = {
        id: '',
        symbol: '',
        is_favorite:''
    }
    let favorites_comparison_arr = []

    let lastToggChange
    let chosenId

    //Dom        

    $(window).on("load", function(e){
        $.get("https://api.coingecko.com/api/v3/coins/list", function(res){
            console.log("All list / res");
            console.log(res);
            $("#loading").show()
            // console.log(res[1]);
            // console.log(res[1]["id"]);
            // console.log(res[1]["symbol"]);
            // console.log(res[1]["name"]);            
            allList = [...res]
            
            draw(res)

            $("#loading").hide()

            $(document).ajaxStop(function(){
                $(".loadingmini").hide();
            });
        }); // $.get
    }); // -------------------------------End: on-load ------------------------------------------------------

     // -------------------------------------------------Start: Home btn click -------------------------------
    $("#home_btn_id").click(function () { 
        $("#row_id").empty()
        // $("#main_about_Div_id").hide()
        // $("#main_about_Div_id").addClass("d-none")

        draw(allList)

        let CurrentFavorites = drawn_cards_arr.filter(fav=>fav.is_favorite==true)
        for (let i = 0; i < CurrentFavorites.length; i++) {
            let currentFavID = CurrentFavorites[i]["id"]
            document.querySelector(".togg"+currentFavID).checked = true;            
        }
        CurrentFavorites = []
        $(".loadingmini").hide()
             
     });
        //---------------------------------------------------End: Home btn click -----------------------------

     //-----------------------------------Start: Draw -------------------------------------------------------
    function draw(res) { 
        let min = res.length > 6 ? 100 : 0
        let max = res.length > 6 ? 200 : res.length        
        for (let i = min ; i < max; i++) {
            
            single_card = {
                id:     res[i]["id"],
                symbol: res[i]["symbol"],
                name:   res[i]["name"]             
            }
            drawn_cards_arr.push(single_card)            

            //create elements
                let symbol_and_tog_div = $("<div></div>")
                symbol_and_tog_div.addClass("d-flex justify-content-between")            

                    let symbol_holder = $("<h5></h5>").text(res[i]["symbol"])            // i (symbol)
                        symbol_holder.addClass("card-title searchRef")
                    
                    let toggel_holder_div = $("<div></div>")
                        toggel_holder_div.addClass("form-check form-switch")
                    
                    let toggle_switch = $("<input></input>") 
                        toggle_switch.addClass("form-check-input")
                        toggle_switch.attr("type","checkbox")
                        toggle_switch.attr("id","flexSwitchCheckDefault")
                        // toggle_switch.attr("cheked",false)
                        toggle_switch.addClass("togg"+res[i]["id"].toString())
                    
                let name_holder = $("<p></p>").text(res[i]["name"])                       // i  (name)
                    name_holder.addClass("card-text searchRef")

                let more_info_btn = $("<butoon></butoon>").text("More Info")
                    more_info_btn.addClass("btn btn-primary more_info_btn")
                    more_info_btn.attr("id",res[i]["id"])                                 //i    insert id to more info btn                     

                let panel_div = $("<div></div>")                                           //more info panel
                    panel_div.addClass("panel")
                    let panel_id_concat = res[i]["id"].toString() + "panel"                //i        
                    panel_div.attr("id",panel_id_concat)                                   // insert id+"panel" to panel's div

                        let hide_market_data_btn = $("<butoon></butoon>").text("Hide market data")
                            hide_market_data_btn.addClass("hide_market_data_btn btn btn-secondary")

                        let eur_market_data = $("<h6></h6>").text("Loading eur data")
                            eur_market_data.addClass("eur")

                        let usd_market_data = $("<h6></h6>").text("Loading usd data")
                            usd_market_data.addClass("usd")

                        let ils_market_data = $("<h6></h6>").text("Loading ils data")
                            ils_market_data.addClass("ils")
                        
                        let coin_thumb = $("<img></img>")


                let card_budy_div = $("<div></div>")
                    card_budy_div.addClass("card-body")

                        let loadermini = $("<img></img>")
                            loadermini.attr("class","loadingmini")
                            loadermini.attr("src","./img/loading.gif")

                let main_card_div = $("<div></div>")
                    main_card_div.addClass("card col-lg-3 col-md-4 col-sm-6 text-white bg-dark border-primary")           

                //Append
                    toggel_holder_div.append(toggle_switch)
                    symbol_and_tog_div.append(symbol_holder,toggel_holder_div)

                    panel_div.append(hide_market_data_btn,eur_market_data,usd_market_data,ils_market_data,coin_thumb)

                    card_budy_div.append(symbol_and_tog_div,name_holder,more_info_btn,panel_div,loadermini)
                    main_card_div.append(card_budy_div)
                    $("#row_id").append(main_card_div)                                       
                }//end of draw for loop
                
                console.log("this is drawn_cards_arr");
                console.log(drawn_cards_arr);
            //--------------------------------------------------------------------------------------more info click-----------
            $(".more_info_btn").click(function(){
                
                //console.dir(this.id+"panel")                    
                
                updateJasonParse()
                let flag = false
                let flag_update_or_push = false
                
                //Grabbing html elements
                let eurHolder =   $(this).next().children().next()
                let usdHolder =   $(this).next().children().next().next()
                let ilsHolder =   $(this).next().children().next().next().next()
                let thumbHolder = $(this).next().children().next().next().next().next()          
                
                //Using existing market data if it's "fresh"
                for (let i = 0; i < market_data_arr.length; i++) {
                    if (market_data_arr[i]["id"] == this.id && ( (new Date().getTime() - market_data_arr[i]["time_stamp"])/1000 < 120) ) {
                        
                        eurHolder.text("EUR: €"+market_data_arr[i]["eur"])
                        usdHolder.text("USD: $"+market_data_arr[i]["usd"])
                        ilsHolder.text("ILS: ₪"+market_data_arr[i]["ils"])
                        thumbHolder.attr("src",market_data_arr[i]["thumb"])

                        flag = true
                    }                        
                }
                
                // $.get: when data is old or a new data is requierd.  if flag == false then $.get is executed
                if (flag == false) {                    
                    $.get(`https://api.coingecko.com/api/v3/coins/`+this.id,function(res){
                        //console.log(res)
                        // console.log(res.id)
                        // console.log(res.market_data.current_price.usd)
                        // console.log(res.image.thumb)
                        
                        $(document).ajaxStart(function(){
                            $(".loadingmini").show();
                        });
                        $(document).ajaxStop(function(){
                            $(".loadingmini").hide();
                        });
                        
                        //update or push a new record (coin)
                        // if a record exists, then : 1. update it with fresh market data. 2. save arr to local storage
                        for (let i = 0; i < market_data_arr.length; i++) {
                            if (market_data_arr[i]["id"] == this.id) {
                                
                                market_data_arr[i]["eur"] = res.market_data.current_price.eur
                                market_data_arr[i]["usd"] = res.market_data.current_price.usd
                                market_data_arr[i]["ils"] = res.market_data.current_price.ils

                                localStorage.setItem('l_c_market_data',JSON.stringify(market_data_arr)) // Save market_data_arr to local storage()
                                flag_update_or_push = true
                            }                            
                        }
                        // when market data is old or does not exist, then create a new record > 1. new object 2. push to arr 3. save to local storage
                        if (flag_update_or_push == false) {                            
                            // create single coin object
                                single_coin ={
                                    id: res.id,
                                    eur: res.market_data.current_price.eur,
                                    usd: res.market_data.current_price.usd,
                                    ils: res.market_data.current_price.ils,
                                    time_stamp: new Date().getTime(),
                                    thumb: res.image.thumb,
                                }
                                market_data_arr.push(single_coin)                                       // Add single coin to market_data_arr
                                localStorage.setItem('l_c_market_data',JSON.stringify(market_data_arr)) // Save market_data_arr to local storage
                        }    else {
                            flag_update_or_push = false
                            }
                            //localStorage.setItem('l_c_market_data',JSON.stringify(market_data_arr)) // Save market_data_arr to local storage   
                            //updateJasonParse()
                        
                            // <h5> update
                            eurHolder.text("EUR: €"+res.market_data.current_price.eur)
                            usdHolder.text("USD: $"+res.market_data.current_price.usd)
                            ilsHolder.text("ILS: ₪"+res.market_data.current_price.ils)
                            thumbHolder.attr("src",res.image.thumb)
                        }) // end of $.get
                } else{
                    flag = false
                } // end of if (for $.get)

                    console.log(market_data_arr);

                $("#"+this.id+"panel").slideDown("slow")
                $("#"+this.id).hide(500);
            }); // ------------------------------------------------------------ End of: "more info" click ---------------------
            
            //-------------------------------------------------------------------------Hide market date -----------------------            
            $(".hide_market_data_btn").click(function(){
                //console.log($(this).parent().attr("id"));
                $("#"+$(this).parent().attr("id")).slideUp("slow"); // slide panel up
                $("#"+$(this).parent().prev().attr("id")).show("slow");                  
            });
             
            //-------------------------------------------------------------------------Toggle ----------------------------------
            $(".form-check-input").change(function () {
                
                // find out if it's true OR false
                let switchStatus = false;
                if ($(this).is(':checked')) {
                    switchStatus = $(this).is(':checked');
                    //alert(switchStatus);// To verify
                }
                else {
                   switchStatus = $(this).is(':checked');
                   //alert(switchStatus);// To verify
                }
                console.log(switchStatus);

                
                //this: coin id                
                chosenId = $(this).parent().parent().next().next().attr("id")                
                console.log("chosenId: "+chosenId);
                
                //last toggle that change <input> grabbing
                lastToggChange = $("#"+chosenId).parent().children().children().next().children()
                console.log(lastToggChange);                 
                
                console.log("this is: drawn_cards_arr *before* updating 'this' change in draw_cards_arr");                       
                console.log(drawn_cards_arr);              
                
                temp5arr = []
                temp5arr = drawn_cards_arr.filter(fav=>fav.is_favorite==true)
                console.log("this is temp5arr before:");
                console.log(temp5arr);
                console.log("Length temp5arr before = "+temp5arr.length);

                //if: how to update drawn_cards_arr
                if (switchStatus == false || (temp5arr.length < 5 && switchStatus == true) ) {
                    for (let i = 0; i < drawn_cards_arr.length; i++) {
                        if (chosenId == drawn_cards_arr[i]["id"] ) {
                            drawn_cards_arr[i]["is_favorite"] = switchStatus
                        }                    
                    }
                } else if (temp5arr.length == 5  && switchStatus == true) {
                    $("#modalBody").empty();
                    $("#submitBtn").attr('disabled', 'disabled');

                    for (let i = 0; i < temp5arr.length; i++) {                                          
                                                
                        //create elements for div modal
                        let p_symbol = $("<p></p>").text(temp5arr[i]["symbol"])     // i
                        p_symbol.addClass("fs-3")
                        
                        let p_id = $("<p></p>").text(temp5arr[i]["id"])             // i
                        p_id.addClass("fs-7")
                        p_id.addClass("d-none")

                        let togg = $('<input class="toggleInModal"></input>')

                        togg.on('click', (e) => {
                            const checked = $(e.target).attr('checked');

                            if (checked === 'checked') {
                                $(e.target).attr('checked', false);
                            } else {
                                $(e.target).attr('checked', true);
                            }

                            const toggleElements = $('.toggleInModal');

                            const checkedToggles = toggleElements.toArray().filter((el) => $(el).attr('checked') === 'checked');

                            if (checkedToggles.length !== 5) {
                                $("#submitBtn").removeAttr('disabled');
                            } else {
                                $("#submitBtn").attr('disabled', 'disabled');
                            }
                        });

                        togg.addClass("form-check-input")
                        togg.attr("id","flexSwitchCheckDefault")
                        togg.attr("type","checkbox")
                        // togg.attr("checked","checked")
                        togg.attr("checked",true)
                        togg.addClass("modal_checkbox")
                        
                        let div_togg_wrapper = $("<div></div>")
                        div_togg_wrapper.addClass("form-check form-switch mt-2")
                        
                        let p_and_toggDiv_wrapper = $("<div></div>")
                        p_and_toggDiv_wrapper.addClass("d-flex justify-content-around")
                        
                        //Append
                        div_togg_wrapper.append(togg)
                        p_and_toggDiv_wrapper.append(p_symbol, p_id, div_togg_wrapper)
                        $("#modalBody").append(p_and_toggDiv_wrapper)
                        
                        //Show div modal
                        $("#mainDivModal").removeClass("d-none") 
                        $("#mainDivModal").addClass("d-fixed")
                        $("#conta_of_cards").hide(1000)
                        
                    } // end of for loop: drawing 5 favorites
                } // end else if
                
                localStorage.setItem('l_s_drawn_cards_arr',JSON.stringify(drawn_cards_arr)) // Save drawn_cards_arr to local storage
                // console.log("this is drawn_cards_arr *after* updating :");
                // console.log(drawn_cards_arr);
                
                temp5arr = []
                temp5arr = drawn_cards_arr.filter(fav=>fav.is_favorite==true)
                console.log("this is temp5arr after:");
                console.log(temp5arr);
                console.log("Length temp5arr after = "+temp5arr.length);
                temp5arr = []
                
                
            }) // -----------------------------------end of toggle change -----------------------------------------------
            
            // --------------------------------------Start: Search ---------------------------------------------------
                $("#searchBtn").on("click", function() {
                    let value = $(".form-control").val().toLowerCase();
                    console.log(value);
                    //console.log(allList);
        
                    // let filteredResults = allList.filter(s=>s.symbol == value)
                    let filteredResults = allList.filter(s=>s.symbol.includes(value))
                    console.log("filteredResults:");
                    console.log(filteredResults);
                    
                    $("#row_id").empty()

                    draw(filteredResults)
                    
                    $(".loadingmini").hide()
                    
                    // $(".searchRef").filter(function() {
                    //   $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                    // });
                });// -----------------------------End: Search ---------------------------------------------------------
    }//----------------------------------------end of draw function -----------------------------------------------------
        
        
    // -----------------------------------Start Event: click cancel on div modal (after 5 true) -------------------

        $("#cancel_xBtn, #cancelBtn").click(function() {
            
            $("#mainDivModal").removeClass("d-fixed")
            $("#mainDivModal").addClass("d-none")
            $("#conta_of_cards").show(1000)                    
            document.querySelector(".togg"+chosenId).checked = false;
            // lastToggChange.attr("checked",false)
            // $(".togg"+chosenId).attr("checked",false)
            $("#modalBody").empty();
            temp5arr = []
        })                              
        //-------------------------------------End of Event: click cancel on div modal (after 5 true)----------------

    // ------------------------------------Start of modal submit click ------------------------------------------
        
        $("#submitBtn").click(function () {
            const checkedItem = drawn_cards_arr.find((item) => item.id === chosenId);
            checkedItem.is_favorite = true;

            let getModal_id = $("p").filter(".fs-7")
            // console.log(getModal_id[0].innerText);
            
            let getModalSymbol = $("p").filter(".fs-3")
            // console.log(getModalSymbol[0].innerText);
            
            let getModalCheckbox = $("input").filter(".modal_checkbox")
            // console.log(getModalCheckbox[0]);
            
            favorites_comparison_arr = []          
            
            for (let i = 0; i < 5; i++) {
                                
                // find out if it's true OR false
                let modal_switchStatus = false;
                if ($(getModalCheckbox[i]).is(':checked')) {
                  modal_switchStatus = $(getModalCheckbox[i]).is(':checked');                    
                }
                else {
                  modal_switchStatus = $(getModalCheckbox[i]).is(':checked');                   
                }
                //console.log(modal_switchStatus);

                single_favorite = {
                    id: getModal_id[i].innerText,
                    symbol: getModalSymbol[i].innerText,
                    is_favorite:modal_switchStatus
                }
                favorites_comparison_arr.push(single_favorite)
            }
            console.log("this is favorites_comparison_arr : ");
            console.log(favorites_comparison_arr);

            let true_in_new_comparison = favorites_comparison_arr.filter(fav=>fav.is_favorite==true)
            // console.log("True in new comparison arr = "+true_in_new_comparison.length);

            if (true_in_new_comparison.length == 5) {
                alert("No changes have been made")
            } else if (true_in_new_comparison.length < 5) {
                
                for (let j = 0; j < favorites_comparison_arr.length; j++) {                    
                    for (let i = 0; i < drawn_cards_arr.length; i++) {
                        if (favorites_comparison_arr[j]["id"] == drawn_cards_arr[i]["id"]) {
                            drawn_cards_arr[i]["is_favorite"] = favorites_comparison_arr[j]["is_favorite"]
                        }                        
                    }
                }
            } 
            
            let false_in_new_comparison = favorites_comparison_arr.filter(fav=>fav.is_favorite==false)
            console.log("false_in_new_comparison arr:");
            console.log(false_in_new_comparison);

            for (let i = 0; i < false_in_new_comparison.length; i++) {
                document.querySelector(".togg"+false_in_new_comparison[i]["id"]).checked = false;                                
            }

            $("#mainDivModal").removeClass("d-fixed")
            $("#mainDivModal").addClass("d-none")
            $("#conta_of_cards").show(1000) 
        }) // end of modal submit btn
        
   //------------------------------------------------------ About --------------------
    $("#aboutBtn").click(function () {
        $("#conta_of_cards").hide()
        $("#mainDivModal").hide()
        $("#home_btn_id").attr('disabled','disabled')
        $("#liveReport").attr('disabled','disabled')
        
        $("#main_about_Div_id").removeClass("d-none")
    })    
      // About: X / close btn  
    $("#about_close_ctn_1, #about_close_ctn_2").click(function () {
        $("#main_about_Div_id").addClass("d-none")
        $("#home_btn_id").removeAttr('disabled')
        $("#liveReport").removeAttr('disabled')
        $("#mainDivModal").show()
        $("#conta_of_cards").show()
    })  


    
});