## Configuration
Take a look at `$.fn.equalHeights.defaults` for configuration options.

## To use ".each()" or not

There is a difference between the following two examples that should be understood.  The difference is that in Example A every .item div will be 100px high, in all groups; and in the second example, the first two .item divs will be 100, the second group's two .item divs will both be 60px, and the last group's .item divs will each be 30px high. **This distinction is important.**

In example A, all children of all .group divs are measured at once and the tallest is used as the height and then applied to every child/target.

In example B, each .group is treated independently.

    <div class="group">
      <div class="item" style="height: 100px;"></div>
      <div class="item"></div>
    </div>

    <div class="group">
      <div class="item" style="height: 60px;"></div>
      <div class="item"></div>
    </div>

    <div class="group">
      <div class="item" style="height: 30px;"></div>
      <div class="item"></div>
    </div>



Example A

    $('.group').equalHeights();

Example B

    $('.group').each(function () {
      $(this).equalHeights();
    });  

## API methods
You can apply the heights using js code using the .respond() method.  To do this you need to capture the EqualHeights object upon instantiation and later call it's respond method.  The same thing can be done with the .reset() method, which removes heights.  Read on for details...

    var eqh = $('div.eqh').equalHeights();

We have captured the object. Now to later call it.

    if (1) {
      eqh.respond();
    }

Finally, you could remove heights programatically as well...

    if (2) {
      eqh.reset();
    }

### EqualHeights object

    var eqh = $('div').equalHeights();

| property | description |
|----------|----------|
| .height | the equalized height |
| .length | the number of targets, receiving the equalized height |

### Delay the height equalization
By passing 'disable' when you instantiate, you will simply get an object that you can use to control heights at a later time as desired.

    var eqh = $('div.eqh').equalHeights({'disable':true});

