$(document).ready(function(){
    var potlocker ={};
    $("<iframe>", {"style": "display:none;" ,"src": "http://potlocker.me/" }).appendTo("body");
    
     potlocker.movies = function (link) {
                
        $(".container").hide(); 
        $(".loading").fadeIn();
             
        $.get(link, function (data) {
            $(".pagination").html($(data).find(".pagination ul").children());
            $(".pagination").fadeIn();   
            potlocker.create( $(data).find("#pm-grid").find("li") );
        });  
        
        return this;
    }
    
    potlocker.search = function(search){
        $(".container").hide(); 
        $(".loading").fadeIn(); 
        $.post("http://potlocker.me/ajax_search.php","queryString=" + search, function (data) { potlocker.create( $(data) ); });
        return this;
    }
    
    potlocker.create = function(items){
        var i = 1;
        var html = "";
        items.each(function(index, value){    
                var value = $(this);
        
                html += '<div class="col-xs-4">' 
                    + '<div class = "thumbnail">'
                    + '<img style="height:255px;width:150px;" src="'+ value.find("img").attr("src") +'">'
                    + '<div class="caption" style="min-height:150px;">'
                    + '<h5>'+ value.find("img").attr("alt") +'</h5>'
                    + '<p class="description well" style="display:none;"></p>'
                    + '<p><a href="'+ value.find("a").attr("href") +'" class="btn btn-primary download" role="button">Download</a>'
                    + '<button class="btn btn-default info" data-link="'+ value.find("a").attr("href") +'" role="button">Info</button></p>'
                    + '</div></div></div>';
                    
                    if(i == 3){
                        $("<div>", {"class" : "row-fluid", html: html }).appendTo("#movie-items");
                        html = "";
                        i = 1;
                    }
                    i++;
                });
                $(".loading").fadeOut();
                $(".container").fadeIn(); 
    }
       
    $(document).on("click", ".download", function(){
        var link = $(this).attr("href");
        $.get(link ,function(result){
            var pattern = /file: \'(http:\/\/potlocker.me\/videos.php\?vid\=[a-z0-9]{8,})\'/g;
            $("<iframe>", {"style": "display:none;" ,"src": pattern.exec(result)[1] }).appendTo("body");      
        });
    });
    
    
    $(document).on("click", ".info", function(){
        var link = $(this).attr("data-link");
        var item = $(this);
        $.get(link ,function(result){ 
            item.closest(".thumbnail").find(".description").html($(result).find(".description").html()).fadeIn();
        });
    });
    
    $(document).on("click", ".pagination li", function(){
        var link = $(this).find("a").attr("href");
        $("#movie-items").html("");
        potlocker.movies(link);
    });
    
    $(document).on("click", "nav li", function(){
        var link = $(this).find("a").attr("href");
        var title = $(this).find("a").attr("data-title");
        $("h1").html(title);
        $("#movie-items").html("");
        potlocker.movies(link);
    });
    
    $(document).on("change", "#search", function(){
        $("h1").html("Search Results");
        $("#movie-items").html("");
        $(".pagination").hide();
        potlocker.search($(this).val());
    });
    
        potlocker.movies("http://potlocker.me/browse-featured-movies-videos-1-date.html");
});