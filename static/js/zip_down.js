/**
 * Created by VectoR on 27-01-2018.
 */
var Promise = window.Promise;
if (!Promise) {
    Promise = JSZip.external.Promise;
}

/**
 * Fetch the content and return the associated promise.
 * @param {String} url the url of the content to fetch.
 * @return {Promise} the promise containing the data.
 */
function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);

            }
        });
    });
}

$("#download-btn").on("click", function () {
    var zip = new JSZip();
    var zip_files = {};
    var zip_count = 0;
    // find every checked item
    if($(".checkbox:checked").length>0){
            $(".checkbox:checked").each(function () {
                var isDirectory = false;
                var $this = $(this);
                var url = $this.data("path");
                var filename = $this.closest('tr').find('.clickable-row').text();
                if($this.attr('id')=='check-dir'){
                    isDirectory = true;
                }
                
                var array = {
                    url : url,
                    filename : filename,
                    isDir : isDirectory,
                };

                zip_files[zip_count] = array;
                zip_count = zip_count + 1;
            
            });

            files = {
                files: JSON.stringify(zip_files),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            };

            console.log(files);
            
            $.post("/download/", files);

            // when everything has been downloaded, we can trigger the dl
            zip.generateAsync({type:"blob"}, function updateCallback(metadata) {

            })
            .then(function callback(blob) {

                // see FileSaver.js
                //saveAs(blob, "download.zip");
            }, function (e) {
            });
        }

    return false;
});