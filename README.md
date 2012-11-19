ImageMapWeaver
=================

```html
<script>
$(document).ready(function() {
  $("map").imageMapWeaver();
});
</script>

<img src="sample.png" usemap="#eventMap" />
<map name="eventMap" id="eventMap">
    <area shape="rect" coords="0,0, 100, 100" href="#" />
</map>
```