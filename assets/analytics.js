/* Site-wide loader for the official GoatCounter embed:
   <script data-goatcounter="https://boss-hunt.goatcounter.com/count"
           async src="//gc.zgo.at/count.js"></script>
   Counts the page as loaded, including while the age gate is up.
   Does not touch the gate or any video. */
(function () {
  var endpoint = "https://boss-hunt.goatcounter.com/count";
  if (document.querySelector('script[data-goatcounter="' + endpoint + '"]')) return;
  var script = document.createElement("script");
  script.async = true;
  script.src = "//gc.zgo.at/count.js";
  script.setAttribute("data-goatcounter", endpoint);
  (document.head || document.documentElement).appendChild(script);
})();
