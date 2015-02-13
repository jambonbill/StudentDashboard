<?php
// student alerts
?>
<br />
<div class="alert alert-success" role="alert"><i class='fa fa-thumbs-up'></i><b>Wow</b> Congratulation, you are ahead of the class !</div>
<!--
<div class="alert alert-success" role="alert"><i class='fa fa-thumbs-up'></i>Congratulation, are doing well</div>
<div class="alert alert-info" role="alert"><i class='fa fa-thumbs-down'></i> It's time to give up</div>
-->

<!--
<div class="alert alert-warning" role="alert">...</div>
<div class="alert alert-danger" role="alert">...</div>
-->



<div class="row">
    <div class="col-md-3 col-sm-6 col-xs-6 text-center">
        <div style="display: inline; width: 90px; height: 90px;"><canvas width="90" height="90"></canvas><input type="text" class="knob" value="30" data-width="90" data-height="90" data-fgcolor="#3c8dbc" style="width: 49px; height: 30px; position: absolute; vertical-align: middle; margin-top: 30px; margin-left: -69px; border: 0px; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 18px; line-height: normal; font-family: Arial; text-align: center; color: rgb(60, 141, 188); padding: 0px; -webkit-appearance: none; background: none;"></div>
        <div class="knob-label">New Visitors</div>
    </div><!-- ./col -->
    <div class="col-md-3 col-sm-6 col-xs-6 text-center">
        <div style="display: inline; width: 90px; height: 90px;"><canvas width="90" height="90"></canvas><input type="text" class="knob" value="70" data-width="90" data-height="90" data-fgcolor="#f56954" style="width: 49px; height: 30px; position: absolute; vertical-align: middle; margin-top: 30px; margin-left: -69px; border: 0px; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 18px; line-height: normal; font-family: Arial; text-align: center; color: rgb(245, 105, 84); padding: 0px; -webkit-appearance: none; background: none;"></div>
        <div class="knob-label">Bounce Rate</div>
    </div><!-- ./col -->
    <div class="col-md-3 col-sm-6 col-xs-6 text-center">
        <div style="display: inline; width: 90px; height: 90px;"><canvas width="90" height="90"></canvas><input type="text" class="knob" value="-80" data-min="-150" data-max="150" data-width="90" data-height="90" data-fgcolor="#00a65a" style="width: 49px; height: 30px; position: absolute; vertical-align: middle; margin-top: 30px; margin-left: -69px; border: 0px; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 18px; line-height: normal; font-family: Arial; text-align: center; color: rgb(0, 166, 90); padding: 0px; -webkit-appearance: none; background: none;"></div>
        <div class="knob-label">Server Load</div>
    </div><!-- ./col -->
    <div class="col-md-3 col-sm-6 col-xs-6 text-center">
        <div style="display: inline; width: 90px; height: 90px;"><canvas width="90" height="90"></canvas><input type="text" class="knob" value="40" data-width="90" data-height="90" data-fgcolor="#00c0ef" style="width: 49px; height: 30px; position: absolute; vertical-align: middle; margin-top: 30px; margin-left: -69px; border: 0px; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 18px; line-height: normal; font-family: Arial; text-align: center; color: rgb(0, 192, 239); padding: 0px; -webkit-appearance: none; background: none;"></div>
        <div class="knob-label">Disk Space</div>
    </div><!-- ./col -->
</div>


<script type="text/javascript">
$(function() {
	/* jQueryKnob */
	$(".knob").knob({
	    /*change : function (value) {
	     //console.log("change : " + value);
	     },
	     release : function (value) {
	     console.log("release : " + value);
	     },
	     cancel : function () {
	     console.log("cancel : " + this.value);
	     },*/
	    draw: function() {

	        // "tron" case
	        if (this.$.data('skin') == 'tron') {
	        	console.log('tron');
	            var a = this.angle(this.cv)  // Angle
	                    , sa = this.startAngle          // Previous start angle
	                    , sat = this.startAngle         // Start angle
	                    , ea                            // Previous end angle
	                    , eat = sat + a                 // End angle
	                    , r = true;

	            this.g.lineWidth = this.lineWidth;

	            this.o.cursor
	                    && (sat = eat - 0.3)
	                    && (eat = eat + 0.3);

	            if (this.o.displayPrevious) {
	                ea = this.startAngle + this.angle(this.value);
	                this.o.cursor
	                        && (sa = ea - 0.3)
	                        && (ea = ea + 0.3);
	                this.g.beginPath();
	                this.g.strokeStyle = this.previousColor;
	                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
	                this.g.stroke();
	            }

	            this.g.beginPath();
	            this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
	            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
	            this.g.stroke();

	            this.g.lineWidth = 2;
	            this.g.beginPath();
	            this.g.strokeStyle = this.o.fgColor;
	            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
	            this.g.stroke();
	            return false;
	        }
	    }
	});
	/* END JQUERY KNOB */
});

</script>