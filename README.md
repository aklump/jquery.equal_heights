## To use ".each()" or not

There is a difference between the following two examples that should be understood.  The difference is that in Example A every .item div will be 100px high, in all groups; and in the second example, the first two .item divs will be 100, the second group's two .item divs will both be 60px, and the last group's .item divs will each be 30px high. **This distinction is important.**

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