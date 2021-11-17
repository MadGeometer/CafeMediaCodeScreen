const MAX_NUM_ADS = 9;
const UNIT_PATH_PREFIX = "/18190176/AdThrive_Content_";

function containsOnlyImage(htmlElt)
{
    let ans = false;

    if (htmlElt && htmlElt.tagName === "P")
    {
        let elementChildren = htmlElt.children;

        if (elementChildren.length > 0 && elementChildren[0].tagName === "IMG")
        {
            ans = true;
        }
    }

    return ans;
}

function onPageLoaded()
{
    if(document.getElementsByTagName("ARTICLE").length === 1)
    {
        let adMapping = googletag.sizeMapping()
            .addSize([300, 250], [320, 50])
            .build();
        
        let contentHolder = document.getElementsByTagName("ARTICLE")[0];

        // This is a shallow copy!
        let elems = contentHolder.children;

        let windowInnerHeight = window.innerHeight;

        let adCount = 0;
        let currentIndex = 0;

        let previousAdLocation = 0;
        let previousDivLocation = 0;
        let distanceBetweenAds = 0;
        
        // Ordinary for-loop wouldn't work here because 
        // contentHolder.children will change as ads are inserted
        while (currentIndex < contentHolder.children.length)
        {
            let previousElement = currentIndex > 0 ? elems[currentIndex - 1] : null;
            let currentElement = elems[currentIndex];

            distanceBetweenAds = currentElement.offsetTop - previousAdLocation;
            
            if (!containsOnlyImage(previousElement) && adCount < MAX_NUM_ADS && distanceBetweenAds >= windowInnerHeight)
            {
                let newElement = document.createElement("div");
                newElement.className = "ad";
                newElement.id = "ad" + adCount;
                //newElement.innerHTML = "Ad #" + adCount + " will go here";
                newElement.innerHTML = "<script>googletag.cmd.push(function() {googletag.display(" + "ad" + adCount + ");});</script>";
                contentHolder.insertBefore(newElement, currentElement);

                // Add a slot to GPT
                googletag.defineSlot(UNIT_PATH_PREFIX + (adCount + 1) + "/test", [[320, 50]], 'ad' + adCount)
                    .defineSizeMapping(adMapping)
                    .addService(googletag.pubads());
                
                distanceBetweenAds = newElement.offsetTop - previousDivLocation;
                
                adCount++;

                // When div is inserted, we have to increment currentIndex twice - see below
                currentIndex++;
                
                previousDivLocation = newElement.offsetTop + newElement.offsetHeight;
                previousAdLocation = newElement.offsetTop + newElement.offsetHeight;
            }
            else 
            {
                // Either max number of ads reached, or..
                // this potential ad location is too close to previous ad
                previousDivLocation = currentElement.offsetTop + currentElement.offsetHeight;
            }

            currentIndex++; 

        } // End while loop
    } // End check for article tag

    // DOM has been properly modified, so we can load the ads!
    googletag.cmd.push(function() { googletag.pubads().refresh(); });

} //End onPageLoaded