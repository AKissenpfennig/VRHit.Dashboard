/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function($, sr) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function(func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize 
    jQuery.fn[sr] = function(fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery, 'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');



// Sidebar
function init_sidebar() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function() {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function(ev) {
        console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            } else {
                if ($BODY.is(".nav-sm")) {
                    $SIDEBAR_MENU.find("li").removeClass("active active-sm");
                    $SIDEBAR_MENU.find("li ul").slideUp();

                }
            }
            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu 
    $MENU_TOGGLE.on('click', function() {
        console.log('clicked - menu toggle');

        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
            $(".shadow").addClass("logo-minimize");
            console.log("it is MD", $SIDEBAR_MENU.find(".logo-inc"))
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
            $(".shadow").removeClass("logo-minimize");
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function() {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function() {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function() {
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: { preventDefault: true }
        });
    }
};
// /Sidebar

var randNum = function() {
    return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
};


// Panel toolbox
$(document).ready(function() {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function() {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function() {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}
// /Progressbar

// Switchery
$(document).ready(function() {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function(html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery


// iCheck
$(document).ready(function() {
    if ($("input.flat")[0]) {
        $(document).ready(function() {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function() {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function() {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function() {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function() {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function() {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function() {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}



// Accordion
$(document).ready(function() {
    $(".expand").on("click", function() {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function() {
        NProgress.start();
    });

    $(window).load(function() {
        NProgress.done();
    });
}


//hover and retain popover when on popover content
var originalLeave = $.fn.popover.Constructor.prototype.leave;
$.fn.popover.Constructor.prototype.leave = function(obj) {
    var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
    var container, timeout;

    originalLeave.call(this, obj);

    if (obj.currentTarget) {
        container = $(obj.currentTarget).siblings('.popover');
        timeout = self.timeout;
        container.one('mouseenter', function() {
            //We entered the actual popover – call off the dogs
            clearTimeout(timeout);
            //Let's monitor popover content instead
            container.one('mouseleave', function() {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
            });
        });
    }
};

$('body').popover({
    selector: '[data-popover]',
    trigger: 'click hover',
    delay: {
        show: 50,
        hide: 400
    }
});


function gd(year, month, day) {
    return new Date(year, month - 1, day).getTime();
}


function init_flot_chart() {

    if (typeof($.plot) === 'undefined') { return; }

    console.log('init_flot_chart');



    var arr_data1 = [
        [gd(2012, 1, 1), 20],
        [gd(2012, 1, 2), 30],
        [gd(2012, 1, 3), 40],
        [gd(2012, 1, 4), 60],
        [gd(2012, 1, 5), 70],
        [gd(2012, 1, 6), 85],
        [gd(2012, 1, 7), 90]
    ];

    var arr_data2 = [
        [gd(2012, 1, 1), 10],
        [gd(2012, 1, 2), 15],
        [gd(2012, 1, 3), 25],
        [gd(2012, 1, 4), 30],
        [gd(2012, 1, 5), 40],
        [gd(2012, 1, 6), 50],
        [gd(2012, 1, 7), 60]
    ];

    var arr_data3 = [
        [0, 1],
        [1, 9],
        [2, 6],
        [3, 10],
        [4, 5],
        [5, 17],
        [6, 6],
        [7, 10],
        [8, 7],
        [9, 11],
        [10, 35],
        [11, 9],
        [12, 12],
        [13, 5],
        [14, 3],
        [15, 4],
        [16, 9]
    ];

    var chart_plot_02_data = [];


    var chart_plot_03_data = [
        [0, 1],
        [1, 9],
        [2, 6],
        [3, 10],
        [4, 5],
        [5, 17],
        [6, 6],
        [7, 10],
        [8, 7],
        [9, 11],
        [10, 35],
        [11, 9],
        [12, 12],
        [13, 5],
        [14, 3],
        [15, 4],
        [16, 9]
    ];
    var chart_plot_05_data = [
        [0, 5],
        [1, 20],
        [2, 10],
        [3, 15],
        [4, 45],
        [5, 37],
        [6, 36],
        [7, 29],
        [8, 37],
        [9, 41],
        [10, 39],
        [11, 39],
        [12, 32],
        [13, 35],
        [14, 23],
        [15, 24],
        [16, 39]
    ];


    for (var i = 0; i < 30; i++) {
        chart_plot_02_data.push([new Date(Date.today().add(i).days()).getTime(), randNum() + i + i + 10]);
    }



    var chart_plot_01_settings = {
        series: {
            lines: {
                show: false,
                fill: true
            },
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
            points: {
                radius: 0,
                show: true
            },
            shadowSize: 2
        },
        grid: {
            verticalLines: true,
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 1,
            color: '#fff'
        },
        colors: ["rgba(38, 185, 154, 0.38)", "rgba(86, 142, 198,1)"],
        xaxis: {
            tickColor: "rgba(51, 51, 51, 0.06)",
            mode: "time",
            tickSize: [1, "Session"],
            //tickLength: 10,
            axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
        },
        yaxis: {
            ticks: 8,
            tickColor: "rgba(51, 51, 51, 0.06)",
        },
        tooltip: false
    }

    var chart_plot_02_settings = {
        grid: {
            show: true,
            aboveData: true,
            color: "#3f3f3f",
            labelMargin: 10,
            axisMargin: 0,
            borderWidth: 0,
            borderColor: null,
            minBorderMargin: 5,
            clickable: true,
            hoverable: true,
            autoHighlight: true,
            mouseActiveRadius: 100
        },
        series: {
            lines: {
                show: true,
                fill: true,
                lineWidth: 2,
                steps: false
            },
            points: {
                show: true,
                radius: 4.5,
                symbol: "circle",
                lineWidth: 3.0
            }
        },
        legend: {
            position: "ne",
            margin: [0, -25],
            noColumns: 0,
            labelBoxBorderColor: null,
            labelFormatter: function(label, series) {
                return label + '&nbsp;&nbsp;';
            },
            width: 40,
            height: 1
        },
        colors: ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'],
        shadowSize: 0,
        tooltip: true,
        tooltipOpts: {
            content: "%s: %y.0",
            xDateFormat: "%d/%m",
            shifts: {
                x: -30,
                y: -50
            },
            defaultTheme: false
        },
        yaxis: {
            min: 0
        },
        xaxis: {
            mode: "time",
            minTickSize: [1, "day"],
            timeformat: "%d",
            min: chart_plot_02_data[0][0],
            max: chart_plot_02_data[20][0]
        }
    };

    var chart_plot_03_settings = {
        series: {
            curvedLines: {
                apply: true,
                active: true,
                monotonicFit: true
            }
        },
        colors: ["#26B99A"],
        grid: {
            borderWidth: {
                top: 0,
                right: 0,
                bottom: 1,
                left: 1
            },
            borderColor: {
                bottom: "#7F8790",
                left: "#7F8790"
            }
        }
    };


    if ($("#chart_plot_01").length) {
        console.log('Plot1');

        $.plot($("#chart_plot_01"), [arr_data1, arr_data2], chart_plot_01_settings);
    }


    if ($("#chart_plot_02").length) {
        console.log('Plot2');

        $.plot($("#chart_plot_02"), [{
            label: "Session Completed",
            data: chart_plot_02_data,
            lines: {
                fillColor: "rgba(150, 202, 89, 0.12)"
            },
            points: {
                fillColor: "#fff"
            }
        }], chart_plot_02_settings);

    }

    if ($("#chart_plot_03").length) {
        console.log('Plot3');
        $.plot($("#chart_plot_03"), [{
            label: "Registrations",
            data: chart_plot_03_data,
            lines: {
                fillColor: "rgba(150, 202, 89, 0.12)"
            },
            points: {
                fillColor: "#fff"
            }
        }], chart_plot_03_settings);

    };

}


/* STARRR */

function init_starrr() {

    if (typeof(starrr) === 'undefined') { return; }
    console.log('init_starrr');

    $(".stars").starrr();

    $('.stars-existing').starrr({
        rating: 4
    });

    $('.stars').on('starrr:change', function(e, value) {
        $('.stars-count').html(value);
    });

    $('.stars-existing').on('starrr:change', function(e, value) {
        $('.stars-count-existing').html(value);
    });

};


function init_JQVmap() {

    //console.log('check init_JQVmap [' + typeof (VectorCanvas) + '][' + typeof (jQuery.fn.vectorMap) + ']' );	

    if (typeof(jQuery.fn.vectorMap) === 'undefined') { return; }

    console.log('init_JQVmap');

    if ($('#world-map-gdp').length) {

        $('#world-map-gdp').vectorMap({
            map: 'world_en',
            backgroundColor: null,
            color: '#ffffff',
            hoverOpacity: 0.7,
            selectedColor: '#666666',
            enableZoom: true,
            showTooltip: true,
            values: sample_data,
            scaleColors: ['#E6F2F0', '#149B7E'],
            normalizeFunction: 'polynomial'
        });

    }

    if ($('#usa_map').length) {

        $('#usa_map').vectorMap({
            map: 'usa_en',
            backgroundColor: null,
            color: '#ffffff',
            hoverOpacity: 0.7,
            selectedColor: '#666666',
            enableZoom: true,
            showTooltip: true,
            values: sample_data,
            scaleColors: ['#E6F2F0', '#149B7E'],
            normalizeFunction: 'polynomial'
        });

    }

};


function init_skycons() {

    if (typeof(Skycons) === 'undefined') { return; }
    console.log('init_skycons');

    var icons = new Skycons({
            "color": "#73879C"
        }),
        list = [
            "clear-day", "clear-night", "partly-cloudy-day",
            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
            "fog"
        ],
        i;

    for (i = list.length; i--;)
        icons.set(list[i], list[i]);

    icons.play();

}


function init_chart_doughnut() {

    if (typeof(Chart) === 'undefined') { return; }

    console.log('init_chart_doughnut');

    if ($('.canvasDoughnut').length) {

        var chart_doughnut_settings = {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: {
                labels: [
                    "CC",
                    "CH",
                    "IB",
                    "NOC",
                    "SD"
                ],
                datasets: [{
                    data: [15, 20, 30, 10, 30],
                    backgroundColor: [
                        "#BDC3C7",
                        "#9B59B6",
                        "#E74C3C",
                        "#26B99A",
                        "#3498DB"
                    ],
                    hoverBackgroundColor: [
                        "#CFD4D8",
                        "#B370CF",
                        "#E95E4F",
                        "#36CAAB",
                        "#49A9EA"
                    ]
                }]
            },
            options: {
                legend: false,
                responsive: false
            }
        }

        $('.canvasDoughnut').each(function() {

            var chart_element = $(this);
            var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

        });

    }

    if ($('.canvasDoughnut2').length) {

        var chart_doughnut_settings = {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: {
                labels: [
                    "CC",
                    "CH",
                    "IB",
                    "NOC",
                    "SD"
                ],
                datasets: [{
                    data: [10, 40, 30, 20, 30],
                    backgroundColor: [
                        "#BDC3C7",
                        "#9B59B6",
                        "#E74C3C",
                        "#26B99A",
                        "#3498DB"
                    ],
                    hoverBackgroundColor: [
                        "#CFD4D8",
                        "#B370CF",
                        "#E95E4F",
                        "#36CAAB",
                        "#49A9EA"
                    ]
                }]
            },
            options: {
                legend: false,
                responsive: false
            }
        }

        $('.canvasDoughnut2').each(function() {

            var chart_element = $(this);
            var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

        });

    }
    if ($('.canvasDoughnut3').length) {

        var chart_doughnut_settings = {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: {
                labels: [
                    "CC",
                    "CH",
                    "IB",
                    "NOC",
                    "SD"
                ],
                datasets: [{
                    data: [15, 35, 20, 30, 8],
                    backgroundColor: [
                        "#BDC3C7",
                        "#9B59B6",
                        "#E74C3C",
                        "#26B99A",
                        "#3498DB"
                    ],
                    hoverBackgroundColor: [
                        "#CFD4D8",
                        "#B370CF",
                        "#E95E4F",
                        "#36CAAB",
                        "#49A9EA"
                    ]
                }]
            },
            options: {
                legend: false,
                responsive: false
            }
        }

        $('.canvasDoughnut3').each(function() {

            var chart_element = $(this);
            var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

        });

    }

}



function init_gauge() {

    if (typeof(Gauge) === 'undefined') { return; }

    console.log('init_gauge [' + $('.gauge-chart').length + ']');

    console.log('init_gauge');


    var chart_gauge_settings = {
        lines: 12,
        angle: 0,
        lineWidth: 0.4,
        pointer: {
            length: 0.75,
            strokeWidth: 0.042,
            color: '#1D212A'
        },
        limitMax: 'false',
        colorStart: '#1ABC9C',
        colorStop: '#1ABC9C',
        strokeColor: '#F0F3F3',
        generateGradient: true
    };


    if ($('#chart_gauge_01').length) {

        var chart_gauge_01_elem = document.getElementById('chart_gauge_01');
        var chart_gauge_01 = new Gauge(chart_gauge_01_elem).setOptions(chart_gauge_settings);

    }


    if ($('#gauge-text').length) {

        chart_gauge_01.maxValue = 6000;
        chart_gauge_01.animationSpeed = 32;
        chart_gauge_01.set(3200);
        chart_gauge_01.setTextField(document.getElementById("gauge-text"));

    }

    if ($('#chart_gauge_02').length) {

        var chart_gauge_02_elem = document.getElementById('chart_gauge_02');
        var chart_gauge_02 = new Gauge(chart_gauge_02_elem).setOptions(chart_gauge_settings);

    }


    if ($('#gauge-text2').length) {

        chart_gauge_02.maxValue = 9000;
        chart_gauge_02.animationSpeed = 32;
        chart_gauge_02.set(2400);
        chart_gauge_02.setTextField(document.getElementById("gauge-text2"));

    }


}

/* SPARKLINES */

function init_sparklines() {

    if (typeof(jQuery.fn.sparkline) === 'undefined') { return; }
    console.log('init_sparklines');


    $(".sparkline_one").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
        type: 'bar',
        height: '125',
        barWidth: 13,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });


    $(".sparkline_two").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
        type: 'bar',
        height: '40',
        barWidth: 9,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });


    $(".sparkline_three").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
        type: 'line',
        width: '200',
        height: '40',
        lineColor: '#26B99A',
        fillColor: 'rgba(223, 223, 223, 0.57)',
        lineWidth: 2,
        spotColor: '#26B99A',
        minSpotColor: '#26B99A'
    });


    $(".sparkline11").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 6, 2, 4, 3, 4, 5, 4, 5, 4, 3], {
        type: 'bar',
        height: '40',
        barWidth: 8,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });

    $(".sparkline12").sparkline([2, 4, 6, 6, 9, 9, 10, 12, 12], {
        type: 'bar',
        height: '40',
        barWidth: 8,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });


    $(".sparkline22").sparkline([2, 4, 3, 4, 7, 5, 4, 3, 5, 6, 2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 6], {
        type: 'line',
        height: '40',
        width: '200',
        lineColor: '#26B99A',
        fillColor: '#ffffff',
        lineWidth: 3,
        spotColor: '#34495E',
        minSpotColor: '#34495E'
    });


    $(".sparkline_bar").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5], {
        type: 'bar',
        colorMap: {
            '7': '#a1a1a1'
        },
        barColor: '#26B99A'
    });


    $(".sparkline_area").sparkline([5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], {
        type: 'line',
        lineColor: '#26B99A',
        fillColor: '#26B99A',
        spotColor: '#4578a0',
        minSpotColor: '#728fb2',
        maxSpotColor: '#6d93c4',
        highlightSpotColor: '#ef5179',
        highlightLineColor: '#8ba8bf',
        spotRadius: 2.5,
        width: 85
    });


    $(".sparkline_line").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5], {
        type: 'line',
        lineColor: '#26B99A',
        fillColor: '#ffffff',
        width: 85,
        spotColor: '#34495E',
        minSpotColor: '#34495E'
    });


    $(".sparkline_pie").sparkline([1, 1, 2, 1], {
        type: 'pie',
        sliceColors: ['#26B99A', '#ccc', '#75BCDD', '#D66DE2']
    });


    $(".sparkline_discreet").sparkline([4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 2, 4, 3, 7, 8, 9, 7, 6, 4, 3], {
        type: 'discrete',
        barWidth: 3,
        lineColor: '#26B99A',
        width: '85',
    });


};


/* AUTOCOMPLETE */

function init_autocomplete() {

    if (typeof(autocomplete) === 'undefined') { return; }
    console.log('init_autocomplete');

    var countries = { AD: "Andorra", A2: "Andorra Test", AE: "United Arab Emirates", AF: "Afghanistan", AG: "Antigua and Barbuda", AI: "Anguilla", AL: "Albania", AM: "Armenia", AN: "Netherlands Antilles", AO: "Angola", AQ: "Antarctica", AR: "Argentina", AS: "American Samoa", AT: "Austria", AU: "Australia", AW: "Aruba", AX: "Åland Islands", AZ: "Azerbaijan", BA: "Bosnia and Herzegovina", BB: "Barbados", BD: "Bangladesh", BE: "Belgium", BF: "Burkina Faso", BG: "Bulgaria", BH: "Bahrain", BI: "Burundi", BJ: "Benin", BL: "Saint Barthélemy", BM: "Bermuda", BN: "Brunei", BO: "Bolivia", BQ: "British Antarctic Territory", BR: "Brazil", BS: "Bahamas", BT: "Bhutan", BV: "Bouvet Island", BW: "Botswana", BY: "Belarus", BZ: "Belize", CA: "Canada", CC: "Cocos [Keeling] Islands", CD: "Congo - Kinshasa", CF: "Central African Republic", CG: "Congo - Brazzaville", CH: "Switzerland", CI: "Côte d’Ivoire", CK: "Cook Islands", CL: "Chile", CM: "Cameroon", CN: "China", CO: "Colombia", CR: "Costa Rica", CS: "Serbia and Montenegro", CT: "Canton and Enderbury Islands", CU: "Cuba", CV: "Cape Verde", CX: "Christmas Island", CY: "Cyprus", CZ: "Czech Republic", DD: "East Germany", DE: "Germany", DJ: "Djibouti", DK: "Denmark", DM: "Dominica", DO: "Dominican Republic", DZ: "Algeria", EC: "Ecuador", EE: "Estonia", EG: "Egypt", EH: "Western Sahara", ER: "Eritrea", ES: "Spain", ET: "Ethiopia", FI: "Finland", FJ: "Fiji", FK: "Falkland Islands", FM: "Micronesia", FO: "Faroe Islands", FQ: "French Southern and Antarctic Territories", FR: "France", FX: "Metropolitan France", GA: "Gabon", GB: "United Kingdom", GD: "Grenada", GE: "Georgia", GF: "French Guiana", GG: "Guernsey", GH: "Ghana", GI: "Gibraltar", GL: "Greenland", GM: "Gambia", GN: "Guinea", GP: "Guadeloupe", GQ: "Equatorial Guinea", GR: "Greece", GS: "South Georgia and the South Sandwich Islands", GT: "Guatemala", GU: "Guam", GW: "Guinea-Bissau", GY: "Guyana", HK: "Hong Kong SAR China", HM: "Heard Island and McDonald Islands", HN: "Honduras", HR: "Croatia", HT: "Haiti", HU: "Hungary", ID: "Indonesia", IE: "Ireland", IL: "Israel", IM: "Isle of Man", IN: "India", IO: "British Indian Ocean Territory", IQ: "Iraq", IR: "Iran", IS: "Iceland", IT: "Italy", JE: "Jersey", JM: "Jamaica", JO: "Jordan", JP: "Japan", JT: "Johnston Island", KE: "Kenya", KG: "Kyrgyzstan", KH: "Cambodia", KI: "Kiribati", KM: "Comoros", KN: "Saint Kitts and Nevis", KP: "North Korea", KR: "South Korea", KW: "Kuwait", KY: "Cayman Islands", KZ: "Kazakhstan", LA: "Laos", LB: "Lebanon", LC: "Saint Lucia", LI: "Liechtenstein", LK: "Sri Lanka", LR: "Liberia", LS: "Lesotho", LT: "Lithuania", LU: "Luxembourg", LV: "Latvia", LY: "Libya", MA: "Morocco", MC: "Monaco", MD: "Moldova", ME: "Montenegro", MF: "Saint Martin", MG: "Madagascar", MH: "Marshall Islands", MI: "Midway Islands", MK: "Macedonia", ML: "Mali", MM: "Myanmar [Burma]", MN: "Mongolia", MO: "Macau SAR China", MP: "Northern Mariana Islands", MQ: "Martinique", MR: "Mauritania", MS: "Montserrat", MT: "Malta", MU: "Mauritius", MV: "Maldives", MW: "Malawi", MX: "Mexico", MY: "Malaysia", MZ: "Mozambique", NA: "Namibia", NC: "New Caledonia", NE: "Niger", NF: "Norfolk Island", NG: "Nigeria", NI: "Nicaragua", NL: "Netherlands", NO: "Norway", NP: "Nepal", NQ: "Dronning Maud Land", NR: "Nauru", NT: "Neutral Zone", NU: "Niue", NZ: "New Zealand", OM: "Oman", PA: "Panama", PC: "Pacific Islands Trust Territory", PE: "Peru", PF: "French Polynesia", PG: "Papua New Guinea", PH: "Philippines", PK: "Pakistan", PL: "Poland", PM: "Saint Pierre and Miquelon", PN: "Pitcairn Islands", PR: "Puerto Rico", PS: "Palestinian Territories", PT: "Portugal", PU: "U.S. Miscellaneous Pacific Islands", PW: "Palau", PY: "Paraguay", PZ: "Panama Canal Zone", QA: "Qatar", RE: "Réunion", RO: "Romania", RS: "Serbia", RU: "Russia", RW: "Rwanda", SA: "Saudi Arabia", SB: "Solomon Islands", SC: "Seychelles", SD: "Sudan", SE: "Sweden", SG: "Singapore", SH: "Saint Helena", SI: "Slovenia", SJ: "Svalbard and Jan Mayen", SK: "Slovakia", SL: "Sierra Leone", SM: "San Marino", SN: "Senegal", SO: "Somalia", SR: "Suriname", ST: "São Tomé and Príncipe", SU: "Union of Soviet Socialist Republics", SV: "El Salvador", SY: "Syria", SZ: "Swaziland", TC: "Turks and Caicos Islands", TD: "Chad", TF: "French Southern Territories", TG: "Togo", TH: "Thailand", TJ: "Tajikistan", TK: "Tokelau", TL: "Timor-Leste", TM: "Turkmenistan", TN: "Tunisia", TO: "Tonga", TR: "Turkey", TT: "Trinidad and Tobago", TV: "Tuvalu", TW: "Taiwan", TZ: "Tanzania", UA: "Ukraine", UG: "Uganda", UM: "U.S. Minor Outlying Islands", US: "United States", UY: "Uruguay", UZ: "Uzbekistan", VA: "Vatican City", VC: "Saint Vincent and the Grenadines", VD: "North Vietnam", VE: "Venezuela", VG: "British Virgin Islands", VI: "U.S. Virgin Islands", VN: "Vietnam", VU: "Vanuatu", WF: "Wallis and Futuna", WK: "Wake Island", WS: "Samoa", YD: "People's Democratic Republic of Yemen", YE: "Yemen", YT: "Mayotte", ZA: "South Africa", ZM: "Zambia", ZW: "Zimbabwe", ZZ: "Unknown or Invalid Region" };

    var countriesArray = $.map(countries, function(value, key) {
        return {
            value: value,
            data: key
        };
    });

    // initialize autocomplete with custom appendTo
    $('#autocomplete-custom-append').autocomplete({
        lookup: countriesArray
    });

};

/* AUTOSIZE */

function init_autosize() {

    if (typeof $.fn.autosize !== 'undefined') {

        autosize($('.resizable_textarea'));

    }

};

/* PARSLEY */

function init_parsley() {

    if (typeof(parsley) === 'undefined') { return; }
    console.log('init_parsley');

    $ /*.listen*/ ('parsley:field:validate', function() {
        validateFront();
    });
    $('#demo-form .btn').on('click', function() {
        $('#demo-form').parsley().validate();
        validateFront();
    });
    var validateFront = function() {
        if (true === $('#demo-form').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
        }
    };

    $ /*.listen*/ ('parsley:field:validate', function() {
        validateFront();
    });
    $('#demo-form2 .btn').on('click', function() {
        $('#demo-form2').parsley().validate();
        validateFront();
    });
    var validateFront = function() {
        if (true === $('#demo-form2').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
        }
    };

    try {
        hljs.initHighlightingOnLoad();
    } catch (err) {}

};


/* INPUTS */

function onAddTag(tag) {
    alert("Added a tag: " + tag);
}

function onRemoveTag(tag) {
    alert("Removed a tag: " + tag);
}

function onChangeTag(input, tag) {
    alert("Changed a tag: " + tag);
}

//tags input
function init_TagsInput() {

    if (typeof $.fn.tagsInput !== 'undefined') {

        $('#tags_1').tagsInput({
            width: 'auto'
        });

    }

};

/* SELECT2 */

function init_select2() {

    if (typeof(select2) === 'undefined') { return; }
    console.log('init_toolbox');

    $(".select2_single").select2({
        placeholder: "Select a state",
        allowClear: true
    });
    $(".select2_group").select2({});
    $(".select2_multiple").select2({
        maximumSelectionLength: 4,
        placeholder: "With Max Selection limit 4",
        allowClear: true
    });

};

/* WYSIWYG EDITOR */

function init_wysiwyg() {

    if (typeof($.fn.wysiwyg) === 'undefined') { return; }
    console.log('init_wysiwyg');

    function init_ToolbarBootstrapBindings() {
        var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
                'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
                'Times New Roman', 'Verdana'
            ],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
        $.each(fonts, function(idx, fontName) {
            fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
        });
        $('a[title]').tooltip({
            container: 'body'
        });
        $('.dropdown-menu input').click(function() {
                return false;
            })
            .change(function() {
                $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
            })
            .keydown('esc', function() {
                this.value = '';
                $(this).change();
            });

        $('[data-role=magic-overlay]').each(function() {
            var overlay = $(this),
                target = $(overlay.data('target'));
            overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
        });

        if ("onwebkitspeechchange" in document.createElement("input")) {
            var editorOffset = $('#editor').offset();

            $('.voiceBtn').css('position', 'absolute').offset({
                top: editorOffset.top,
                left: editorOffset.left + $('#editor').innerWidth() - 35
            });
        } else {
            $('.voiceBtn').hide();
        }
    }

    function showErrorAlert(reason, detail) {
        var msg = '';
        if (reason === 'unsupported-file-type') {
            msg = "Unsupported format " + detail;
        } else {
            console.log("error uploading file", reason, detail);
        }
        $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
    }

    $('.editor-wrapper').each(function() {
        var id = $(this).attr('id'); //editor-one

        $(this).wysiwyg({
            toolbarSelector: '[data-target="#' + id + '"]',
            fileUploadError: showErrorAlert
        });
    });


    window.prettyPrint;
    prettyPrint();

};

/* CROPPER */

function init_cropper() {


    if (typeof($.fn.cropper) === 'undefined') { return; }
    console.log('init_cropper');

    var $image = $('#image');
    var $download = $('#download');
    var $dataX = $('#dataX');
    var $dataY = $('#dataY');
    var $dataHeight = $('#dataHeight');
    var $dataWidth = $('#dataWidth');
    var $dataRotate = $('#dataRotate');
    var $dataScaleX = $('#dataScaleX');
    var $dataScaleY = $('#dataScaleY');
    var options = {
        aspectRatio: 16 / 9,
        preview: '.img-preview',
        crop: function(e) {
            $dataX.val(Math.round(e.x));
            $dataY.val(Math.round(e.y));
            $dataHeight.val(Math.round(e.height));
            $dataWidth.val(Math.round(e.width));
            $dataRotate.val(e.rotate);
            $dataScaleX.val(e.scaleX);
            $dataScaleY.val(e.scaleY);
        }
    };


    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();


    // Cropper
    $image.on({
        'build.cropper': function(e) {
            console.log(e.type);
        },
        'built.cropper': function(e) {
            console.log(e.type);
        },
        'cropstart.cropper': function(e) {
            console.log(e.type, e.action);
        },
        'cropmove.cropper': function(e) {
            console.log(e.type, e.action);
        },
        'cropend.cropper': function(e) {
            console.log(e.type, e.action);
        },
        'crop.cropper': function(e) {
            console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
        },
        'zoom.cropper': function(e) {
            console.log(e.type, e.ratio);
        }
    }).cropper(options);


    // Buttons
    if (!$.isFunction(document.createElement('canvas').getContext)) {
        $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
    }

    if (typeof document.createElement('cropper').style.transition === 'undefined') {
        $('button[data-method="rotate"]').prop('disabled', true);
        $('button[data-method="scale"]').prop('disabled', true);
    }


    // Download
    if (typeof $download[0].download === 'undefined') {
        $download.addClass('disabled');
    }


    // Options
    $('.docs-toggles').on('change', 'input', function() {
        var $this = $(this);
        var name = $this.attr('name');
        var type = $this.prop('type');
        var cropBoxData;
        var canvasData;

        if (!$image.data('cropper')) {
            return;
        }

        if (type === 'checkbox') {
            options[name] = $this.prop('checked');
            cropBoxData = $image.cropper('getCropBoxData');
            canvasData = $image.cropper('getCanvasData');

            options.built = function() {
                $image.cropper('setCropBoxData', cropBoxData);
                $image.cropper('setCanvasData', canvasData);
            };
        } else if (type === 'radio') {
            options[name] = $this.val();
        }

        $image.cropper('destroy').cropper(options);
    });


    // Methods
    $('.docs-buttons').on('click', '[data-method]', function() {
        var $this = $(this);
        var data = $this.data();
        var $target;
        var result;

        if ($this.prop('disabled') || $this.hasClass('disabled')) {
            return;
        }

        if ($image.data('cropper') && data.method) {
            data = $.extend({}, data); // Clone a new one

            if (typeof data.target !== 'undefined') {
                $target = $(data.target);

                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val());
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }

            result = $image.cropper(data.method, data.option, data.secondOption);

            switch (data.method) {
                case 'scaleX':
                case 'scaleY':
                    $(this).data('option', -data.option);
                    break;

                case 'getCroppedCanvas':
                    if (result) {

                        // Bootstrap's Modal
                        $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

                        if (!$download.hasClass('disabled')) {
                            $download.attr('href', result.toDataURL());
                        }
                    }

                    break;
            }

            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result));
                } catch (e) {
                    console.log(e.message);
                }
            }

        }
    });

    // Keyboard
    $(document.body).on('keydown', function(e) {
        if (!$image.data('cropper') || this.scrollTop > 300) {
            return;
        }

        switch (e.which) {
            case 37:
                e.preventDefault();
                $image.cropper('move', -1, 0);
                break;

            case 38:
                e.preventDefault();
                $image.cropper('move', 0, -1);
                break;

            case 39:
                e.preventDefault();
                $image.cropper('move', 1, 0);
                break;

            case 40:
                e.preventDefault();
                $image.cropper('move', 0, 1);
                break;
        }
    });

    // Import image
    var $inputImage = $('#inputImage');
    var URL = window.URL || window.webkitURL;
    var blobURL;

    if (URL) {
        $inputImage.change(function() {
            var files = this.files;
            var file;

            if (!$image.data('cropper')) {
                return;
            }

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function() {

                        // Revoke when load complete
                        URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }


};

/* CROPPER --- end */

/* KNOB */

function init_knob() {

    if (typeof($.fn.knob) === 'undefined') { return; }
    console.log('init_knob');

    $(".knob").knob({
        change: function(value) {
            //console.log("change : " + value);
        },
        release: function(value) {
            //console.log(this.$.attr('value'));
            console.log("release : " + value);
        },
        cancel: function() {
            console.log("cancel : ", this);
        },
        /*format : function (value) {
         return value + '%';
         },*/
        draw: function() {

            // "tron" case
            if (this.$.data('skin') == 'tron') {

                this.cursorExt = 0.3;

                var a = this.arc(this.cv) // Arc
                    ,
                    pa // Previous arc
                    , r = 1;

                this.g.lineWidth = this.lineWidth;

                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
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

    // Example of infinite knob, iPod click wheel
    var v, up = 0,
        down = 0,
        i = 0,
        $idir = $("div.idir"),
        $ival = $("div.ival"),
        incr = function() {
            i++;
            $idir.show().html("+").fadeOut();
            $ival.html(i);
        },
        decr = function() {
            i--;
            $idir.show().html("-").fadeOut();
            $ival.html(i);
        };
    $("input.infinite").knob({
        min: 0,
        max: 20,
        stopper: false,
        change: function() {
            if (v > this.cv) {
                if (up) {
                    decr();
                    up = 0;
                } else {
                    up = 1;
                    down = 0;
                }
            } else {
                if (v < this.cv) {
                    if (down) {
                        incr();
                        down = 0;
                    } else {
                        down = 1;
                        up = 0;
                    }
                }
            }
            v = this.cv;
        }
    });

};

/* INPUT MASK */

function init_InputMask() {

    if (typeof($.fn.inputmask) === 'undefined') { return; }
    console.log('init_InputMask');

    $(":input").inputmask();

};

/* COLOR PICKER */

function init_ColorPicker() {

    if (typeof($.fn.colorpicker) === 'undefined') { return; }
    console.log('init_ColorPicker');

    $('.demo1').colorpicker();
    $('.demo2').colorpicker();

    $('#demo_forceformat').colorpicker({
        format: 'rgba',
        horizontal: true
    });

    $('#demo_forceformat3').colorpicker({
        format: 'rgba',
    });

    $('.demo-auto').colorpicker();

};


/* ION RANGE SLIDER */

function init_IonRangeSlider() {

    if (typeof($.fn.ionRangeSlider) === 'undefined') { return; }
    console.log('init_IonRangeSlider');

    $("#range_27").ionRangeSlider({
        type: "double",
        min: 1000000,
        max: 2000000,
        grid: true,
        force_edges: true
    });
    $("#range").ionRangeSlider({
        hide_min_max: true,
        keyboard: true,
        min: 0,
        max: 5000,
        from: 1000,
        to: 4000,
        type: 'double',
        step: 1,
        prefix: "$",
        grid: true
    });
    $("#range_25").ionRangeSlider({
        type: "double",
        min: 1000000,
        max: 2000000,
        grid: true
    });
    $("#range_26").ionRangeSlider({
        type: "double",
        min: 0,
        max: 10000,
        step: 500,
        grid: true,
        grid_snap: true
    });
    $("#range_31").ionRangeSlider({
        type: "double",
        min: 0,
        max: 100,
        from: 30,
        to: 70,
        from_fixed: true
    });
    $(".range_min_max").ionRangeSlider({
        type: "double",
        min: 0,
        max: 100,
        from: 30,
        to: 70,
        max_interval: 50
    });
    $(".range_time24").ionRangeSlider({
        min: +moment().subtract(12, "hours").format("X"),
        max: +moment().format("X"),
        from: +moment().subtract(6, "hours").format("X"),
        grid: true,
        force_edges: true,
        prettify: function(num) {
            var m = moment(num, "X");
            return m.format("Do MMMM, HH:mm");
        }
    });

};


/* PICKER */

function init_daterangepicker() {

    if (typeof($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker');

    var cb = function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    };

    $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    $('#reportrange').daterangepicker(optionSet1, cb);
    $('#reportrange').on('show.daterangepicker', function() {
        console.log("show event fired");
    });
    $('#reportrange').on('hide.daterangepicker', function() {
        console.log("hide event fired");
    });
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
        console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
    });
    $('#reportrange').on('cancel.daterangepicker', function(ev, picker) {
        console.log("cancel event fired");
    });
    $('#options1').click(function() {
        $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
    });
    $('#options2').click(function() {
        $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
    });
    $('#destroy').click(function() {
        $('#reportrange').data('daterangepicker').remove();
    });

}

function init_daterangepicker_right() {

    if (typeof($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker_right');

    var cb = function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $('#reportrange_right span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2020',
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'right',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    };

    $('#reportrange_right span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

    $('#reportrange_right').daterangepicker(optionSet1, cb);

    $('#reportrange_right').on('show.daterangepicker', function() {
        console.log("show event fired");
    });
    $('#reportrange_right').on('hide.daterangepicker', function() {
        console.log("hide event fired");
    });
    $('#reportrange_right').on('apply.daterangepicker', function(ev, picker) {
        console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
    });
    $('#reportrange_right').on('cancel.daterangepicker', function(ev, picker) {
        console.log("cancel event fired");
    });

    $('#options1').click(function() {
        $('#reportrange_right').data('daterangepicker').setOptions(optionSet1, cb);
    });

    $('#options2').click(function() {
        $('#reportrange_right').data('daterangepicker').setOptions(optionSet2, cb);
    });

    $('#destroy').click(function() {
        $('#reportrange_right').data('daterangepicker').remove();
    });

}

function init_daterangepicker_single_call() {

    if (typeof($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker_single_call');

    $('#single_cal1').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_1"
    }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#single_cal2').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_2"
    }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#single_cal3').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_3"
    }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#single_cal4').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_4"
    }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });


}


function init_daterangepicker_reservation() {

    if (typeof($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker_reservation');

    $('#reservation').daterangepicker(null, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });

    $('#reservation-time').daterangepicker({
        timePicker: true,
        timePickerIncrement: 30,
        locale: {
            format: 'MM/DD/YYYY h:mm A'
        }
    });

}

$(document).ready(function() {
    var date_input = $('input[name="daterange1"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);
})

$(document).ready(function() {
    var date_input = $('input[name="daterange2"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);
})

/* SMART WIZARD */

function init_SmartWizard() {

    if (typeof($.fn.smartWizard) === 'undefined') { return; }
    console.log('init_SmartWizard');

    $('#wizard').smartWizard();

    $('#wizard_verticle').smartWizard({
        transitionEffect: 'slide'
    });

    $('.buttonNext').addClass('btn btn-success');
    $('.buttonPrevious').addClass('btn btn-primary');
    $('.buttonFinish').addClass('btn btn-default');

};

//Show form group
$(document).ready(function() {
    $("#injured label input[type=radio][name=injured]").change(function() {
        var injuredYes = $('input[name="injured"]:checked').val();
        console.log(injuredYes == 'yes')
        if (injuredYes == "yes") {
            $(".stepContainer").css("height", "")
            $("#injuryTypes").css("display", "inherit");
        } else {
            $('#ininjuryTypes input[type=checkbox]').attr('disabled', 'true');
            $("#injuryTypes").css("display", "none")
                //$(".stepContainer").css("height", "")
        }
    });
});


/* VALIDATOR */

function init_validator() {

    if (typeof(validator) === 'undefined') { return; }
    console.log('init_validator');

    // initialize the validator function
    validator.message.date = 'not a real date';

    // validate a field on "blur" event, a 'select' on 'change' event & a '.reuired' classed multifield on 'keyup':
    $('form')
        .on('blur', 'input[required], input.optional, select.required', validator.checkField)
        .on('change', 'select.required', validator.checkField)
        .on('keypress', 'input[required][pattern]', validator.keypress);

    $('.multi.required').on('keyup blur', 'input', function() {
        validator.checkField.apply($(this).siblings().last()[0]);
    });

    $('form').submit(function(e) {
        e.preventDefault();
        var submit = true;

        // evaluate the form using generic validaing
        if (!validator.checkAll($(this))) {
            submit = false;
        }

        if (submit)
            this.submit();

        return false;
    });

};

/* PNotify */

function init_PNotify() {

    if (typeof(PNotify) === 'undefined') { return; }
    console.log('init_PNotify');

    new PNotify({
        title: "PNotify",
        type: "info",
        text: "Welcome. Try hovering over me. You can click things behind me, because I'm non-blocking.",
        nonblock: {
            nonblock: true
        },
        addclass: 'dark',
        styling: 'bootstrap3',
        hide: false,
        before_close: function(PNotify) {
            PNotify.update({
                title: PNotify.options.title + " - Enjoy your Stay",
                before_close: null
            });

            PNotify.queueRemove();

            return false;
        }
    });

};


/* CUSTOM NOTIFICATION */

function init_CustomNotification() {

    console.log('run_customtabs');

    if (typeof(CustomTabs) === 'undefined') { return; }
    console.log('init_CustomTabs');

    var cnt = 10;

    TabbedNotification = function(options) {
        var message = "<div id='ntf" + cnt + "' class='text alert-" + options.type + "' style='display:none'><h2><i class='fa fa-bell'></i> " + options.title +
            "</h2><div class='close'><a href='javascript:;' class='notification_close'><i class='fa fa-close'></i></a></div><p>" + options.text + "</p></div>";

        if (!document.getElementById('custom_notifications')) {
            alert('doesnt exists');
        } else {
            $('#custom_notifications ul.notifications').append("<li><a id='ntlink" + cnt + "' class='alert-" + options.type + "' href='#ntf" + cnt + "'><i class='fa fa-bell animated shake'></i></a></li>");
            $('#custom_notifications #notif-group').append(message);
            cnt++;
            CustomTabs(options);
        }
    };

    CustomTabs = function(options) {
        $('.tabbed_notifications > div').hide();
        $('.tabbed_notifications > div:first-of-type').show();
        $('#custom_notifications').removeClass('dsp_none');
        $('.notifications a').click(function(e) {
            e.preventDefault();
            var $this = $(this),
                tabbed_notifications = '#' + $this.parents('.notifications').data('tabbed_notifications'),
                others = $this.closest('li').siblings().children('a'),
                target = $this.attr('href');
            others.removeClass('active');
            $this.addClass('active');
            $(tabbed_notifications).children('div').hide();
            $(target).show();
        });
    };

    CustomTabs();

    var tabid = idname = '';

    $(document).on('click', '.notification_close', function(e) {
        idname = $(this).parent().parent().attr("id");
        tabid = idname.substr(-2);
        $('#ntf' + tabid).remove();
        $('#ntlink' + tabid).parent().remove();
        $('.notifications a').first().addClass('active');
        $('#notif-group div').first().css('display', 'block');
    });

};

/* EASYPIECHART */

function init_EasyPieChart() {

    if (typeof($.fn.easyPieChart) === 'undefined') { return; }
    console.log('init_EasyPieChart');

    $('.chart').easyPieChart({
        easing: 'easeOutElastic',
        delay: 3000,
        barColor: '#26B99A',
        trackColor: '#fff',
        scaleColor: false,
        lineWidth: 20,
        trackWidth: 16,
        lineCap: 'butt',
        onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });
    var chart = window.chart = $('.chart').data('easyPieChart');
    $('.js_update').on('click', function() {
        chart.update(Math.random() * 200 - 100);
    });

    //hover and retain popover when on popover content
    var originalLeave = $.fn.popover.Constructor.prototype.leave;
    $.fn.popover.Constructor.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
        var container, timeout;

        originalLeave.call(this, obj);

        if (obj.currentTarget) {
            container = $(obj.currentTarget).siblings('.popover');
            timeout = self.timeout;
            container.one('mouseenter', function() {
                //We entered the actual popover – call off the dogs
                clearTimeout(timeout);
                //Let's monitor popover content instead
                container.one('mouseleave', function() {
                    $.fn.popover.Constructor.prototype.leave.call(self, self);
                });
            });
        }
    };

    $('body').popover({
        selector: '[data-popover]',
        trigger: 'click hover',
        delay: {
            show: 50,
            hide: 400
        }
    });

};


function init_charts() {

    console.log('run_charts  typeof [' + typeof(Chart) + ']');

    if (typeof(Chart) === 'undefined') { return; }

    console.log('init_charts');


    Chart.defaults.global.legend = {
        enabled: false
    };



    if ($('#canvas_line').length) {

        var canvas_line_00 = new Chart(document.getElementById("canvas_line"), {
            type: 'line',
            data: {
                labels: ["CC", "CH", "CW", "IB", "IH", "IP", "IW"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line1').length) {

        var canvas_line_01 = new Chart(document.getElementById("canvas_line1"), {
            type: 'line',
            data: {
                labels: ["Craig", "Chris", "Cillian", "Isaac", "Ian H", "Ian P", "Ian W"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line2').length) {

        var canvas_line_02 = new Chart(document.getElementById("canvas_line2"), {
            type: 'line',
            data: {
                labels: ["Craig", "Chris", "Cillian", "Isaac", "Ian H", "Ian P", "Ian W"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line3').length) {

        var canvas_line_03 = new Chart(document.getElementById("canvas_line3"), {
            type: 'line',
            data: {
                labels: ["Craig", "Chris", "Cillian", "Isaac", "Ian H", "Ian P", "Ian W"],
                datasets: [{
                    label: "Test 1",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "Test 2",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line4').length) {

        var canvas_line_04 = new Chart(document.getElementById("canvas_line4"), {
            type: 'line',
            data: {
                labels: ["Craig", "Chris", "Cillian", "Isaac", "Ian H", "Ian P", "Ian W"],
                datasets: [{
                    label: "Test 1",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "Test 2",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    // Line chart

    if ($('#lineChart').length) {

        var ctx = document.getElementById("lineChart");
        var lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Craig", "Chris", "Cillian", "Isaac", "Ian H", "Ian P", "Ian W", "Niall", "Paul", "Robbie", "Simon", "Thomas"],
                datasets: [{
                    label: "Max Speed",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [173, 150, 193, 180, 201, 169, 156, 166, 224, 177, 150, 148]
                }]
            },
        });
    }

    // Bar chart
    data_ts = {
        labels: ["Craig", "Chris", "Cillian", "Isaac", "Ian H", "Ian P", "Ian W", "Niall", "Paul", "Robbie", "Simon", "Thomas"],
        datasets: [{
            label: 'Tackle Success %',
            backgroundColor: "#26B99A",
            data: [23, 38, 39, 81, 39, 41, 26, 13, 65, 44, 47, 9]
        }]
    };

    console.log(data_ts)

    if ($('#mybarChart').length) {

        var ctx = document.getElementById("mybarChart");
        var mybarChart = new Chart(ctx, {
            type: 'bar',
            data: data_ts,

            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }


    // Doughnut chart
    donought_data = {
        labels: [
            //   "Dark Grey",
            //   "Purple Color",
            //   "Gray Color",
            "% Successful Tackle",
            "% Unsuccessful Tackle"
        ],
        datasets: [{
            //   data: [120, 50, 140, 180, 100],
            data: [38.75, 61.25],
            backgroundColor: [
                // "#455C73",
                // "#9B59B6",
                // "#BDC3C7",
                "#26B99A",
                "#E91E63"
            ],
            hoverBackgroundColor: [
                // "#34495E",
                // "#B370CF",
                // "#CFD4D8",
                "#36CAAB",
                "#49A9EA"
            ]

        }]
    };

    if ($('#canvasDoughnut').length) {

        var ctx = document.getElementById("canvasDoughnut");
        var data = donought_data;

        var canvasDoughnut = new Chart(ctx, {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: data
        });

    }

    // Radar chart

    if ($('#canvasRadar').length) {

        var ctx = document.getElementById("canvasRadar");
        var data = {
            labels: ["Alex 1", "Alex 2", "Alex 3", "Alex 4", "Jean 1", "Jean 2", "Louis"],
            datasets: [{
                label: "Speed (cm/s)",
                backgroundColor: "rgba(3, 88, 106, 0.2)",
                borderColor: "rgba(3, 88, 106, 0.80)",
                pointBorderColor: "rgba(3, 88, 106, 0.80)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.80)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                data: [100, 159, 190, 171, 130, 185, 140]
            }]
        };

        var canvasRadar = new Chart(ctx, {
            type: 'radar',
            data: data,
        });

    }


    // Pie chart
    if ($('#pieChart').length) {

        var ctx = document.getElementById("pieChart");
        var data = {
            datasets: [{
                data: [62, 38],
                backgroundColor: [
                    "#455C73",
                    "#45735a"
                ],
                label: 'My dataset' // for legend
            }],


            labels: [
                "Unsuccessful",
                "successful"
            ]
        };

        var pieChart = new Chart(ctx, {
            data: data,
            type: 'pie',
            otpions: {
                legend: false
            }
        });

    }


    // PolarArea chart

    if ($('#polarArea').length) {

        var ctx = document.getElementById("polarArea");
        var data = {
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                label: 'My dataset'
            }],
            labels: [
                "Dark Gray",
                "Purple",
                "Gray",
                "Green",
                "Blue"
            ]
        };

        var polarArea = new Chart(ctx, {
            data: data,
            type: 'polarArea',
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });

    }
}

/* COMPOSE */

function init_compose() {

    if (typeof($.fn.slideToggle) === 'undefined') { return; }
    console.log('init_compose');

    $('#compose, .compose-close').click(function() {
        $('.compose').slideToggle();
    });

};

/* CALENDAR */

function init_calendar() {

    if (typeof($.fn.fullCalendar) === 'undefined') { return; }
    console.log('init_calendar');

    var date = new Date(),
        d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear(),
        started,
        categoryClass;

    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        },
        selectable: true,
        selectHelper: true,
        select: function(start, end, allDay) {
            $('#fc_create').click();

            started = start;
            ended = end;

            $(".antosubmit").on("click", function() {
                var title = $("#title").val();
                if (end) {
                    ended = end;
                }

                categoryClass = $("#event_type").val();

                if (title) {
                    calendar.fullCalendar('renderEvent', {
                            title: title,
                            start: started,
                            end: end,
                            allDay: allDay
                        },
                        true // make the event "stick"
                    );
                }

                $('#title').val('');

                calendar.fullCalendar('unselect');

                $('.antoclose').click();

                return false;
            });
        },
        eventClick: function(calEvent, jsEvent, view) {
            $('#fc_edit').click();
            $('#title2').val(calEvent.title);

            categoryClass = $("#event_type").val();

            $(".antosubmit2").on("click", function() {
                calEvent.title = $("#title2").val();

                calendar.fullCalendar('updateEvent', calEvent);
                $('.antoclose2').click();
            });

            calendar.fullCalendar('unselect');
        },
        editable: true,
        events: [{
            title: 'Training Session Craig',
            start: new Date(y, m, 1)
        }, {
            title: 'Test',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2)
        }, {
            title: 'Training Session Niall',
            start: new Date(y, m, d, 10, 30),
            allDay: false
        }, {
            title: 'Training session Simon',
            start: new Date(y, m, d + 14, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false
        }, {
            title: 'Training Session Ian H',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false
        }, {
            title: 'Training Session Paul',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }]
    });

};

/* DATA TABLES */

function init_DataTables() {

    console.log('run_datatables');

    if (typeof($.fn.DataTable) === 'undefined') { return; }
    console.log('init_DataTables');

    var handleDataTableButtons = function() {
        if ($("#datatable-buttons").length) {
            $("#datatable-buttons").DataTable({
                dom: "Bfrtip",
                buttons: [{
                        extend: "copy",
                        className: "btn-sm"
                    },
                    {
                        extend: "csv",
                        className: "btn-sm"
                    },
                    {
                        extend: "excel",
                        className: "btn-sm"
                    },
                    {
                        extend: "pdfHtml5",
                        className: "btn-sm"
                    },
                    {
                        extend: "print",
                        className: "btn-sm"
                    },
                ],
                responsive: true
            });
        }
    };

    TableManageButtons = function() {
        "use strict";
        return {
            init: function() {
                handleDataTableButtons();
            }
        };
    }();

    $('#datatable').dataTable();

    $('#datatable-keytable').DataTable({
        keys: true
    });

    $('#datatable-responsive').DataTable();

    $('#datatable-scroller').DataTable({
        ajax: "js/datatables/json/scroller-demo.json",
        deferRender: true,
        scrollY: 380,
        scrollCollapse: true,
        scroller: true
    });

    $('#datatable-fixed-header').DataTable({
        fixedHeader: true
    });

    var $datatable = $('#datatable-checkbox');

    $datatable.dataTable({
        'order': [
            [1, 'asc']
        ],
        'columnDefs': [
            { orderable: false, targets: [0] }
        ]
    });
    $datatable.on('draw.dt', function() {
        $('checkbox input').iCheck({
            checkboxClass: 'icheckbox_flat-green'
        });
    });

    TableManageButtons.init();

};

/* CHART - MORRIS  */

function init_morris_charts() {

    if (typeof(Morris) === 'undefined') { return; }
    console.log('init_morris_charts');

    if ($('#graph_bar').length) {

        Morris.Bar({
            element: 'graph_bar',
            data: [
                { device: 'iPhone 4', geekbench: 380 },
                { device: 'iPhone 4S', geekbench: 655 },
                { device: 'iPhone 3GS', geekbench: 275 },
                { device: 'iPhone 5', geekbench: 1571 },
                { device: 'iPhone 5S', geekbench: 655 },
                { device: 'iPhone 6', geekbench: 2154 },
                { device: 'iPhone 6 Plus', geekbench: 1144 },
                { device: 'iPhone 6S', geekbench: 2371 },
                { device: 'iPhone 6S Plus', geekbench: 1471 },
                { device: 'Other', geekbench: 1371 }
            ],
            xkey: 'device',
            ykeys: ['geekbench'],
            labels: ['Geekbench'],
            barRatio: 0.4,
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            xLabelAngle: 35,
            hideHover: 'auto',
            resize: true
        });

    }

    if ($('#graph_bar_group').length) {

        Morris.Bar({
            element: 'graph_bar_group',
            data: [
                { "period": "2016-10-01", "licensed": 807, "sorned": 660 },
                { "period": "2016-09-30", "licensed": 1251, "sorned": 729 },
                { "period": "2016-09-29", "licensed": 1769, "sorned": 1018 },
                { "period": "2016-09-20", "licensed": 2246, "sorned": 1461 },
                { "period": "2016-09-19", "licensed": 2657, "sorned": 1967 },
                { "period": "2016-09-18", "licensed": 3148, "sorned": 2627 },
                { "period": "2016-09-17", "licensed": 3471, "sorned": 3740 },
                { "period": "2016-09-16", "licensed": 2871, "sorned": 2216 },
                { "period": "2016-09-15", "licensed": 2401, "sorned": 1656 },
                { "period": "2016-09-10", "licensed": 2115, "sorned": 1022 }
            ],
            xkey: 'period',
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            ykeys: ['licensed', 'sorned'],
            labels: ['Licensed', 'SORN'],
            hideHover: 'auto',
            xLabelAngle: 60,
            resize: true
        });

    }

    if ($('#graphx').length) {

        Morris.Bar({
            element: 'graphx',
            data: [
                { x: '2015 Q1', y: 2, z: 3, a: 4 },
                { x: '2015 Q2', y: 3, z: 5, a: 6 },
                { x: '2015 Q3', y: 4, z: 3, a: 2 },
                { x: '2015 Q4', y: 2, z: 4, a: 5 }
            ],
            xkey: 'x',
            ykeys: ['y', 'z', 'a'],
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            hideHover: 'auto',
            labels: ['Y', 'Z', 'A'],
            resize: true
        }).on('click', function(i, row) {
            console.log(i, row);
        });

    }

    if ($('#graph_area').length) {

        Morris.Area({
            element: 'graph_area',
            data: [
                { period: '2014 Q1', iphone: 2666, ipad: null, itouch: 2647 },
                { period: '2014 Q2', iphone: 2778, ipad: 2294, itouch: 2441 },
                { period: '2014 Q3', iphone: 4912, ipad: 1969, itouch: 2501 },
                { period: '2014 Q4', iphone: 3767, ipad: 3597, itouch: 5689 },
                { period: '2015 Q1', iphone: 6810, ipad: 1914, itouch: 2293 },
                { period: '2015 Q2', iphone: 5670, ipad: 4293, itouch: 1881 },
                { period: '2015 Q3', iphone: 4820, ipad: 3795, itouch: 1588 },
                { period: '2015 Q4', iphone: 15073, ipad: 5967, itouch: 5175 },
                { period: '2016 Q1', iphone: 10687, ipad: 4460, itouch: 2028 },
                { period: '2016 Q2', iphone: 8432, ipad: 5713, itouch: 1791 }
            ],
            xkey: 'period',
            ykeys: ['iphone', 'ipad', 'itouch'],
            lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            labels: ['iPhone', 'iPad', 'iPod Touch'],
            pointSize: 2,
            hideHover: 'auto',
            resize: true
        });

    }

    if ($('#graph_donut').length) {

        Morris.Donut({
            element: 'graph_donut',
            data: [
                { label: 'Jam', value: 25 },
                { label: 'Frosted', value: 40 },
                { label: 'Custard', value: 25 },
                { label: 'Sugar', value: 10 }
            ],
            colors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            formatter: function(y) {
                return y + "%";
            },
            resize: true
        });

    }

    if ($('#graph_line').length) {

        Morris.Line({
            element: 'graph_line',
            xkey: 'year',
            ykeys: ['value'],
            labels: ['Value'],
            hideHover: 'auto',
            lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            data: [
                { year: '2012', value: 20 },
                { year: '2013', value: 10 },
                { year: '2014', value: 5 },
                { year: '2015', value: 5 },
                { year: '2016', value: 20 }
            ],
            resize: true
        });

        $MENU_TOGGLE.on('click', function() {
            $(window).resize();
        });

    }

};



/* ECHRTS */


function init_echarts() {

    if (typeof(echarts) === 'undefined') { return; }
    console.log('init_echarts');


    var theme = {
        color: [
            '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],

        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#31708f'
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#7e7e7e',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#7e7e7e'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#7e7e7e'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#7e7e7e'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#7e7e7e'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#7e7e7e'
            },
            controlStyle: {
                normal: { color: '#7e7e7e' },
                emphasis: { color: '#7e7e7e' }
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {
                    areaStyle: {
                        color: '#99d2dd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
                    }
                }
            }
        },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                show: true,
                lineStyle: {
                    color: [
                        [0.2, '#86b379'],
                        [0.8, '#68a54a'],
                        [1, '#408829']
                    ],
                    width: 8
                }
            },
            axisTick: {
                splitNumber: 10,
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    color: 'auto'
                }
            }
        },
        textStyle: {
            // fontFamily: 'Arial, Verdana, sans-serif'
        }
    };


    //echart Bar

    // if ($('#mainb').length ){

    // 	  var echartBar = echarts.init(document.getElementById('mainb'), theme);

    // 	  echartBar.setOption({
    // 		title: {
    // 		  text: 'Tackles',
    // 		  subtext: 'Deceptive Movements'
    // 		},
    // 		tooltip: {
    // 		  trigger: 'axis'
    // 		},
    // 		legend: {
    // 		  data: ['Left', 'Right']
    // 		},
    // 		toolbox: {
    // 		  show: false
    // 		},
    // 		calculable: false,
    // 		xAxis: [{
    // 		  type: 'category',
    // 		  data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    // 		}],
    // 		yAxis: [{
    // 		  type: 'value'
    // 		}],
    // 		series: [{
    // 		  name: 'Left',
    // 		  type: 'bar',
    // 		  data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
    // 		  markPoint: {
    // 			data: [{
    // 			  type: 'max',
    // 			  name: '???'
    // 			}, {
    // 			  type: 'min',
    // 			  name: '???'
    // 			}]
    // 		  },
    // 		  markLine: {
    // 			data: [{
    // 			  type: 'average',
    // 			  name: '???'
    // 			}]
    // 		  }
    // 		}, {
    // 		  name: 'Right',
    // 		  type: 'bar',
    // 		  data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
    // 		  markPoint: {
    // 			data: [{
    // 			  name: 'Left',
    // 			  value: 182.2,
    // 			  xAxis: 7,
    // 			  yAxis: 183,
    // 			}, {
    // 			  name: 'Right',
    // 			  value: 2.3,
    // 			  xAxis: 11,
    // 			  yAxis: 3
    // 			}]
    // 		  },
    // 		  markLine: {
    // 			data: [{
    // 			  type: 'average',
    // 			  name: '???'
    // 			}]
    // 		  }
    // 		}]
    // 	  });

    // }

    function removeDuplicates(arr) {
        let unique_array = []
        for (let i = 0; i < arr.length; i++) {
            if (unique_array.indexOf(arr[i]) == -1) {
                unique_array.push(arr[i])
            }
        }
        return unique_array
    }

    //echart for the debug mode
    function analysis(file_name) {
        //  Loading the local csv data
        if (!file_name) {
            var file_name = "Craig.csv";
        };

        //var url = "../../Data/"+file_name;
        var url = "../../Data/Experts_ind_data_2018/" + file_name;

        var data, player, tackle_succ, dec_time;
        var dm = Papa.parse(url, {
            download: true,
            skipEmptyLines: true,
            complete: function(db) {
                console.log(db);
                db = db.data.slice(1);

                players = db.map(function(item) {
                    // Participant name and side
                    var itt = item[0].split("-");
                    // itt = itt[1];

                    var side = itt[itt.length - 1].slice(1)

                    var itd = (itt[1].slice(0, 4))
                        // console.log(itd.join("-"+side))
                    return itd + "-" + side;
                });

                stimulus = db.map(function(item) {
                    return item[1]
                });

                data = db.map(function(item) {
                    // return [+item[1], +item[2], +item[5], +item[6]];
                    // max displacement
                    return +item[16]
                });

                data_l = db.map(function(item) {
                    // return [+item[1], +item[2], +item[5], +item[6]];
                    // max displacement
                    return +item[16] * Math.random()
                });



                tackle_succ = db.map(function(item) {
                    // return [+item[1], +item[2], +item[5], +item[6]];
                    // tackle sucess
                    return +item[16]
                });

                tackle_succ_l = db.map(function(item) {
                    // tackle sucess left
                    if (item[2] == 'L') {
                        return +item[16]
                    }
                });
                tackle_succ_r = db.map(function(item) {
                    // tackle sucess right
                    if (item[2] == 'R') {
                        return +item[16]
                    }
                });

                var Tackle_succ_l_percentage = 0;
                var Tackle_succ_r_percentage = 0;

                for (i in tackle_succ_l) {
                    if (!tackle_succ_l[i]) continue;
                    Tackle_succ_l_percentage += tackle_succ_l[i];
                }
                for (j in tackle_succ_r) {
                    if (!tackle_succ_r[j]) continue;
                    Tackle_succ_r_percentage += tackle_succ_r[j];
                }
                Tackle_succ_l_percentage = Tackle_succ_l_percentage / tackle_succ_l.filter(function(value) { return value !== undefined }).length;
                Tackle_succ_r_percentage = Tackle_succ_r_percentage / tackle_succ_r.filter(function(value) { return value !== undefined }).length;

                // make condition if the success is zero
                Tackle_succ_l_percentage = Tackle_succ_l_percentage == 0 ? 0.00 : Tackle_succ_l_percentage == 1 ? 1 : Tackle_succ_l_percentage;
                Tackle_succ_r_percentage = Tackle_succ_r_percentage == 0 ? 0.00 : Tackle_succ_r_percentage == 1 ? 1 : Tackle_succ_r_percentage;

                // console.log(Tackle_succ_l_percentage,Tackle_succ_r_percentage)

                // Decision time
                dec_time_r = db.map(function(item) {

                    // "time_moving_for_tackle"
                    // return {success: +item[16], time: +item[32]}
                    return +item[34]
                })
                dec_time_l = db.map(function(item) {

                    // "time_moving_for_tackle"
                    // return {success: +item[16], time: +item[32]}
                    return +item[35] * (-1);
                })


                var dec_time_r = [],
                    dec_time_l = [],
                    tackle_s_p_l = [],
                    tackle_s_p_r = [],
                    disp_l = [],
                    disp_r = [];


                for (i in db) {
                    var dc = db[i][32],
                        tc = db[i][16],
                        itt = db[i][0].split("-"),
                        side = itt[itt.length - 1].split("")[2];
                    side = db[i][1] + "-" + side;

                    if (db[i][2] == 'L') dec_time_l.push([dc * -1, side]);
                    if (db[i][2] == 'R') dec_time_r.push([dc, side]);

                    if (db[i][2] == 'L') tackle_s_p_l.push([tc * -100, side]);
                    if (db[i][2] == 'R') tackle_s_p_r.push([tc * 100, side]);

                    if (db[i][2] == 'L') disp_l.push([side, db[i][5]]);
                    if (db[i][2] == 'R') disp_r.push([side, db[i][5]]);
                };

                dec_time_avg = { left: dec_time_l, right: dec_time_r };
                tackle_sucess_avg = { left: tackle_s_p_l, right: tackle_s_p_r };
                displacement_avg = { left: disp_l, right: disp_r }; //Displacement Avg




                participants = db.map(function(item) {
                        return item[0]
                    })
                    // dec_time=[];
                    // dec_time.push(dec_time_tmp);


                // console.log(dec_time_l, dec_time_r)

                var Tackle_succ_percentage = 0;

                for (i in tackle_succ) {
                    Tackle_succ_percentage += tackle_succ[i];
                }

                Tackle_succ_percentage = Tackle_succ_percentage / (tackle_succ.length);

                // console.log(tackle_succ,Tackle_succ_percentage, (tackle_succ.length))

                tackle_data = [{ value: Tackle_succ_percentage, name: "Successful", selected: true },
                    { value: (1 - Tackle_succ_percentage), name: "Unsuccessful" }
                ];

                tackle_data_a = [
                    { value: Tackle_succ_r_percentage * 100, name: "Successful Right", selected: true },
                    { value: (1 - Tackle_succ_r_percentage) * 100 + 1, name: "Unsuccessful Right", selected: true },
                    { value: (1 - Tackle_succ_l_percentage) * 100, name: "Unsuccessful Left", selected: true },
                    { value: Tackle_succ_l_percentage * 100, name: "Successful Left", selected: true }
                ];

                var total_for_balance = (Tackle_succ_r_percentage + Tackle_succ_l_percentage);

                tackle_balance = [
                    { value: (Tackle_succ_r_percentage / total_for_balance) * 100, name: "Right", selected: true },
                    { value: (Tackle_succ_l_percentage / total_for_balance) * 100, name: "Left" },
                ];

                dec_time_detail = [];

                for (j = 0; j < 5; j++) {
                    var tmp = db.map(function(item) {
                        return [item[0], +item[34 + j]]
                    })
                    dec_time_detail.push(tmp)
                }


                dec_time_succ_l = [];
                dec_time_unsucc_l = [];
                dec_time_succ_r = [];
                dec_time_unsucc_r = [];
                decision_time_all = { left: { suc: null, unsuc: null }, right: { suc: null, unsuc: null } };

                // for (j=0;j<5;j++){
                // 	var tmp = db.map(function(item){
                // 		return [item[0], item[2], +item[17+j],+item[34+j]]
                // 	})
                // 	console.log(tmp)
                // 	if (tmp[1]=='L' && tmp[2]==1) dec_time_succ_l.push([tmp[0],tmp[3]]);
                // 	if (tmp[1]=='L' && tmp[2]==0) dec_time_unsucc_l.push([tmp[0],tmp[3]]);
                // 	if (tmp[1]=='R' && tmp[2]==1) dec_time_succ_r.push([tmp[0],tmp[3]]);
                // 	if (tmp[1]=='R' && tmp[2]==0) dec_time_unsucc_r.push([tmp[0],tmp[3]]);
                // }

                // decision_time_all.push(dec_time_succ_l, dec_time_unsucc_l, dec_time_succ_r, dec_time_unsucc_r);

                var particiapnts_sides = [];

                for (i in db) {
                    var itt = db[i][0].split("-");
                    var side = itt[itt.length - 1].split("")[2];
                    side = db[i][1] + "-" + side;

                    particiapnts_sides.push(side)
                }
                particiapnts_sides = removeDuplicates(particiapnts_sides);



                for (i in db) {
                    for (j = 0; j < 5; j++) {
                        var tc = db[i][17 + j];
                        var dc = db[i][34 + j];

                        var itt = db[i][0].split("-");
                        var side = itt[itt.length - 1].split("")[2];
                        side = db[i][1] + "-" + side;


                        if (db[i][2] == 'L' && tc == 1) { dec_time_succ_l.push([side, dc]); }
                        if (db[i][2] == 'L' && tc == 0) { dec_time_unsucc_l.push([side, dc]); }
                        if (db[i][2] == 'R' && tc == 1) { dec_time_succ_r.push([side, dc]); }
                        if (db[i][2] == 'R' && tc == 0) { dec_time_unsucc_r.push([side, dc]); }

                    }
                }
                decision_time_all.left.suc = dec_time_succ_l;
                decision_time_all.left.unsuc = dec_time_unsucc_l;
                decision_time_all.right.suc = dec_time_succ_r;
                decision_time_all.right.unsuc = dec_time_unsucc_r;
                // decision_time_all.push(dec_time_succ_l, dec_time_unsucc_l, dec_time_succ_r, dec_time_unsucc_r);
                // console.log("decision time ---->>>>>>", decision_time_all)




                // Fatigue --------->
                fatigue_lable = [];
                fatigue_data = [];
                for (i in db) {

                    for (j = 0; j < 5; j++) {
                        var tc = db[i][17 + j];
                        var itt = db[i][0].split("-");
                        var side = itt[itt.length - 1].slice(1);
                        var itd = (itt[1].slice(0, 4));
                        var lable = itd + "-" + side + "-T" + (j + 1);

                        fatigue_lable.push(lable)
                        fatigue_data.push([lable, db[i][17 + j]]);

                    }

                }



                // Distance covered indiv ----
                distance_covered = { left: null, right: null };
                dist_cov_l = [];
                dist_cov_r = [];
                for (i in db) {

                    var itt = db[i][0].split("-");
                    var side = itt[itt.length - 1].split("")[2];
                    side = db[i][1] + "-" + side;

                    // var itd = (itt[1].slice(0,4));
                    // var lable =  itd +"-"+ side+"-T"+(j+1);
                    if (db[i][2] == 'L') dist_cov_l.push([side, db[i][7]]);
                    if (db[i][2] == 'R') dist_cov_r.push([side, db[i][7]]);


                }
                distance_covered.left = dist_cov_l;
                distance_covered.right = dist_cov_r;





                // Momvent effiecency ---------
                var movement_eff = db.map(function(item) {
                    // if (item[16]!= 0) return +item[9]*100
                    return +item[9] * 100
                });

                console.log(movement_eff)

                movement_eff = movement_eff.filter(function(value) { return value !== undefined })

                var movement_eff_d = 0

                for (i in movement_eff) {
                    movement_eff_d += movement_eff[i];
                }

                movement_eff_d = (movement_eff_d / movement_eff.length);






                var overall_decision_t = db.map(function(item) {
                    return (+item[32] / item[4]) * 100
                })

                var decision_t = 0
                for (i in overall_decision_t) {
                    decision_t += overall_decision_t[i];
                }

                decision_t = (decision_t / overall_decision_t.length);

                console.log("dec time ---->", decision_t, "eff ----->", movement_eff_d, "tackle--->", Tackle_succ_percentage, 'tackle lengh', tackle_succ.length)

                solar_data = [decision_t, Tackle_succ_percentage * 100, movement_eff_d];

                var dist_covered = db.map(function(item) {
                    return +item[7]
                })




                var speed_tmp = db.map(function(item) {
                    return +item[24]
                })

                console.log('DB ---> ', speed_tmp)

                var solar_data_speed = speed_tmp;

                console.log('Speed ---> ', solar_data_speed)

                function averageSpeed() {
                    var speed_avg = 0
                    for (i in speed_tmp) {
                        speed_avg += speed_tmp[i];
                    }
                    speed_avg = (speed_avg / speed_tmp.length).toFixed(2);
                    return speed_avg;
                }
                // console.log(speed_avg)

                if ($('#echart_sonar').length) {

                    var echartRadar_speed = echarts.init(document.getElementById('echart_sonar'), theme);

                    echartRadar_speed.setOption({
                        title: {
                            text: 'Max speed per trial',
                            subtext: '(cm/s)'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'right',
                            y: 'bottom',
                            data: ['Max Speed']
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                restore: {
                                    show: true,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        polar: [{
                            indicator: [{
                                    text: 'Alex 1',
                                    max: 202
                                }, {
                                    text: 'Alex 2',
                                    max: 202
                                }, {
                                    text: 'Alex 3',
                                    max: 202
                                }, {
                                    text: 'Alex 4',
                                    max: 202
                                }, {
                                    text: 'Jean 1',
                                    max: 202
                                }, {
                                    text: 'Jean 2',
                                    max: 202
                                }, {
                                    text: 'Louis',
                                    max: 202
                                },
                                /*{
													text: 'Trial 8',
													max: 250
														}*/
                            ]
                        }],
                        calculable: true,
                        series: [{
                            name: 'Max speed',
                            type: 'radar',
                            data: [{
                                value: solar_data_speed,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter: function(params) {
                                            return (params.value).toFixed(0) + ' cm/s';
                                        },
                                        textStyle: {
                                            color: '#0a5170',
                                            fontSize: 11
                                        }
                                    }
                                }
                            }],
                        }]
                    });

                }


                if ($('#mainb').length) {

                    var echartBarMD = echarts.init(document.getElementById('mainb'), theme);

                    echartBarMD.setOption({
                        title: {
                            text: 'Direction left/right',
                            subtext: 'For each Side-Step'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['Left', 'Right'],
                            orient: 'vertical',
                            right: 10,
                        },
                        toolbox: {
                            show: false
                        },
                        grid: {
                            bottom: 80
                        },
                        calculable: false,
                        xAxis: [{
                            type: 'category',
                            scale: true,
                            data: particiapnts_sides,
                            axisLabel: {
                                interval: 0,
                                rotate: 90,
                                fontSize: 9
                            },
                        }],
                        yAxis: [{
                            name: 'Displacement (cm)',
                            nameLocation: 'middle',
                            nameGap: 30,
                            type: 'value',
                            scale: true,
                            splitLine: {
                                show: false
                            },
                        }],
                        series: [{
                                name: 'Left',
                                type: 'bar',
                                barWidth: '30%',
                                // type: 'candlestick',
                                label: {
                                    normal: {
                                        position: 'top',
                                        show: true,
                                        textStyle: {
                                            fontSize: 10
                                                // color: '#31708fa1'
                                        },
                                        formatter: function(params) {
                                            return (params.data[1] * 1).toFixed(0)
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [15, 15, 0, 0],
                                        color: '#34485d'
                                    }
                                },
                                data: displacement_avg.left,
                                // markPoint: {
                                // data: [{
                                // 	type: 'max',
                                // 	name: '???'
                                // }, {
                                // 	type: 'min',
                                // 	name: '???'
                                // }]
                                // },
                                // markLine: {
                                // data: [{
                                // 	type: 'average',
                                // 	name: '???'
                                // }]
                                // }
                            },
                            {
                                name: 'Right',
                                type: 'bar',
                                barWidth: '30%',
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [15, 15, 0, 0],
                                    }
                                },
                                label: {
                                    normal: {
                                        position: 'top',
                                        show: true,
                                        textStyle: {
                                            fontSize: 10
                                                // color: '#31708fa1'
                                        },
                                        formatter: function(params) {
                                            return (params.data[1] * 1).toFixed(0)
                                        }
                                    }
                                },
                                data: displacement_avg.right,
                                // markPoint: {
                                // data: [{
                                // 	name: 'Left',
                                // 	value: 182.2,
                                // 	xAxis: 7,
                                // 	yAxis: 183,
                                // }, {
                                // 	name: 'Right',
                                // 	value: 2.3,
                                // 	xAxis: 11,
                                // 	yAxis: 3
                                // }]
                                // },
                                // markLine: {
                                // data: [{
                                // 	type: 'average',
                                // 	name: '???'
                                // }]
                                // }
                            }
                        ]
                    });

                    // window.onresize = function() {
                    // 	echartBarMD.resize();
                    // };

                }


                // 	if ($('#main_dist_covered').length ){

                // 		var echartBarMDC = echarts.init(document.getElementById('main_dist_covered'), theme);

                // 		echartBarMDC.setOption({
                // 		title: {
                // 			text: 'Average Distance Covered',
                // 			subtext: 'For each Side-Step'
                // 		},
                // 		tooltip: {
                // 			trigger: 'axis'
                // 		},
                // 		// legend: {
                // 		// 	data: ['Left', 'Right'],
                // 		// 	right: 10,
                // 		// },
                // 		toolbox: {
                // 			show: false
                // 		},
                // 		calculable: false,
                // 		xAxis: [{
                // 			type: 'category',
                // 			scale: true,
                // 			data: players,
                // 			axisLabel: {
                // 				interval: 0,
                // 				rotate: 90
                // 		},
                // 		}],
                // 		yAxis: [{
                // 			name: 'Displacement (cm)',
                // 			nameLocation: 'middle',
                // 			nameGap: 30,
                // 			type: 'value',
                // 			scale: true
                // 		}],
                // 		series: [ 
                // 		{
                // 			// name: 'Right',
                // 			type: 'bar',
                // 			barWidth:'30%',
                // 			data: dist_covered,
                // 			// markPoint: {
                // 			// data: [{
                // 			// 	name: 'Left',
                // 			// 	value: 182.2,
                // 			// 	xAxis: 7,
                // 			// 	yAxis: 183,
                // 			// }, {
                // 			// 	name: 'Right',
                // 			// 	value: 2.3,
                // 			// 	xAxis: 11,
                // 			// 	yAxis: 3
                // 			// }]
                // 			// },
                // 			markLine: {
                // 			data: [{
                // 				type: 'average',
                // 				name: 'Mean'
                // 			}]
                // 			},
                // 			label: {
                // 				normal: {
                // 					position: 'top',
                // 					show: true,
                // 					textStyle: {
                // 						color: '#31708fa1'
                // 					},
                // 					formatter: function (params) {
                // 						if (params.data ==0) return ""
                // 						return (params.data * 1).toFixed(2)+'cm'
                // 					}
                // 				}
                // 			},
                // 			itemStyle: {
                // 				normal: {
                // 					barBorderRadius:[15,15,0,0],
                // 						color: '#31708f'
                // 				}
                // 			}
                // 		},
                // 		// {
                // 		// 	name: 'Left',
                // 		// 	type: 'bar',
                // 		// 	// type: 'candlestick',
                // 		// 	label: {
                // 		// 		normal: {
                // 		// 			position: 'top',
                // 		// 			show: true,
                // 		// 			textStyle: {
                // 		// 				color: '#31708fa1'
                // 		// 			}
                // 		// 		}
                // 		// 	},
                // 		// 	// data: data,
                // 		// 	// markPoint: {
                // 		// 	// data: [{
                // 		// 	// 	type: 'max',
                // 		// 	// 	name: '???'
                // 		// 	// }, {
                // 		// 	// 	type: 'min',
                // 		// 	// 	name: '???'
                // 		// 	// }]
                // 		// 	// },
                // 		// 	// markLine: {
                // 		// 	// data: [{
                // 		// 	// 	type: 'average',
                // 		// 	// 	name: '???'
                // 		// 	// }]
                // 		// 	// }
                // 		// }
                // 	]
                // 		});

                // 		// window.onresize = function() {
                // 		// 	echartBarMDC.resize();
                // 		// };

                // }



                if ($('#main_dist_covered_b').length) {

                    var echartBarDistC = echarts.init(document.getElementById('main_dist_covered_b'), theme);

                    echartBarDistC.setOption({
                        title: {
                            text: 'Left / Right',
                            subtext: 'For each Side-Step'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            bottom: 80
                        },
                        legend: {
                            data: ['Left', 'Right'],
                            orient: 'vertical',
                            right: 10,
                        },
                        toolbox: {
                            show: false
                        },
                        calculable: false,
                        xAxis: [{
                            type: 'category',
                            scale: true,
                            data: particiapnts_sides,
                            axisLabel: {
                                interval: 0,
                                rotate: 45,
                                fontSize: 10
                            },
                        }],
                        yAxis: [{
                            name: 'Distance (cm)',
                            nameLocation: 'middle',
                            nameGap: 30,
                            type: 'value',
                            scale: true,
                            splitLine: {
                                show: false
                            },
                        }],
                        series: [{
                                name: 'Left',
                                type: 'bar',
                                barWidth: '30%',
                                barGap: '20%',
                                barCategoryGap: '40%',
                                data: distance_covered.left,
                                // markPoint: {
                                // data: [{
                                // 	name: 'Left',
                                // 	value: 182.2,
                                // 	xAxis: 7,
                                // 	yAxis: 183,
                                // }, {
                                // 	name: 'Right',
                                // 	value: 2.3,
                                // 	xAxis: 11,
                                // 	yAxis: 3
                                // }]
                                // },
                                // markLine: {
                                // data: [{
                                // 	type: 'average',
                                // 	name: 'Mean'
                                // }]
                                // },
                                label: {
                                    normal: {
                                        position: 'top',
                                        show: true,
                                        fontSize: 10,
                                        textStyle: {
                                            // color: '#31708fa1'
                                        },
                                        formatter: function(params) {
                                            return (params.data[1] * 1).toFixed(0)
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [15, 15, 0, 0],
                                        color: '#34485d'
                                    }
                                }
                            },
                            {
                                name: 'Right',
                                type: 'bar',
                                barWidth: '30%',
                                // type: 'candlestick',
                                label: {
                                    normal: {
                                        position: 'top',
                                        show: true,
                                        fontSize: 10,
                                        textStyle: {
                                            // color: '#31708fa1'
                                        },
                                        formatter: function(params) {
                                            return (params.data[1] * 1).toFixed(0)
                                        }
                                    }
                                },
                                data: distance_covered.right,
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [15, 15, 0, 0]
                                    }
                                }
                                // markPoint: {
                                // data: [{
                                // 	type: 'max',
                                // 	name: '???'
                                // }, {
                                // 	type: 'min',
                                // 	name: '???'
                                // }]
                                // },
                                // markLine: {
                                // data: [{
                                // 	type: 'average',
                                // 	name: '???'
                                // }]
                                // }
                            }
                        ]
                    });

                    window.onresize = function() {
                        echartBarDistC.resize();
                    };

                }




                if ($('#echart_pie2').length) {

                    var echartPieCollapseOTB = echarts.init(document.getElementById('echart_pie2'), theme);

                    echartPieCollapseOTB.setOption({
                        title: {
                            text: 'Left/Right Tackle Success',
                            subtext: 'For each side individually'
                        },
                        tooltip: {
                            trigger: 'item',
                            //formatter: "{a} <br/>{b} : {c} ({d}%)"
                            //formatter: "{d}%"
                        },
                        // grid: {
                        // 	top: 590,
                        // 	bottom: 90
                        // },
                        legend: {
                            x: 'center',
                            y: 'bottom',
                            data: ["Successful Left", "Unsuccessful Left",
                                "Successful Right", "Unsuccessful Right"
                            ]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                magicType: {
                                    show: true,
                                    type: ['pie', 'funnel']
                                },
                                restore: {
                                    show: true,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        calculable: true,
                        series: [{
                            name: 'Area Mode',
                            type: 'pie',
                            boundaryGap: '40%',
                            //radius: [50,140],
                            radius: ['25%', '70%'],
                            center: ['51%', '50%'],
                            roseType: 'area',
                            // roseType : 'radius',
                            x: '50%',
                            max: 40,
                            sort: 'ascending',
                            // data: [{
                            // value: 10,
                            // name: 'Player1'
                            // }, {
                            // value: 5,
                            // name: 'Player2'
                            // }, {
                            // value: 15,
                            // name: 'Player3'
                            // }, {
                            // value: 25,
                            // name: 'Player4'
                            // }, {
                            // value: 20,
                            // name: 'Player5'
                            // }, {
                            // value: 35,
                            // name: 'Player6'
                            // }]

                            data: tackle_data_a,
                            selectedOffset: 2,
                            legend: {
                                show: true,
                                x: 'center',
                                y: 'bottom',
                                data: ["Successful left", "Unsuccessful left", "Successful right", "Unsuccessful right"]
                            },
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            // '#28b999','#c70400','#28b999','#c70400',
                                            '#28b999', '#34495d', '#860048', '#009e7b'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                    label: {
                                        textStyle: {
                                            fontSize: 13,
                                        },

                                        // position: 'inner',
                                        // formatter: '{d}% ',
                                        position: 'outer',
                                        formatter: function(params) {
                                            // console.log('param ---->', params)
                                            return (params.percent - 0).toFixed(2) + '% \n' //+ params.name
                                        }
                                    }
                                },

                            }
                        }]
                    });

                    window.onresize = function() {
                        echartPieCollapseOTB.resize();
                    };

                }



                if ($('#echart_pie3').length) {

                    var echartPieCollapse = echarts.init(document.getElementById('echart_pie3'), theme);

                    echartPieCollapse.setOption({
                        title: {
                            text: 'Left & Right Tackle Bias',
                        },
                        // tooltip: {
                        //   trigger: 'item',
                        // 	formatter: "{a} <br/>{b} : {c} ({d}%)"
                        // 	formatter: "{d}%"
                        // },
                        // grid: {
                        // 	top: 590,
                        // 	bottom: 90
                        // },
                        // legend: {
                        //   x: 'center',
                        //   y: 'bottom',
                        //   data: ["Left", "Right"]
                        // },
                        legend: {
                            x: 'center',
                            y: 'bottom',
                            data: ["Left", "Right"]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                magicType: {
                                    show: true,
                                    type: ['pie', 'funnel']
                                },
                                restore: {
                                    show: true,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        calculable: true,
                        series: [{
                            name: 'Area Mode',
                            type: 'pie',
                            radius: [25, 110],
                            // radius: ['20%', '70%'],
                            center: ['50%', '50%'],
                            roseType: 'area',
                            x: '50%',
                            max: 40,
                            sort: 'ascending',
                            // data: [{
                            // value: 10,
                            // name: 'Player1'
                            // }, {
                            // value: 5,
                            // name: 'Player2'
                            // }, {
                            // value: 15,
                            // name: 'Player3'
                            // }, {
                            // value: 25,
                            // name: 'Player4'
                            // }, {
                            // value: 20,
                            // name: 'Player5'
                            // }, {
                            // value: 35,
                            // name: 'Player6'
                            // }]
                            data: tackle_balance,
                            selectedOffset: 3,
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            // '#28b999','#c70400','#28b999','#c70400',
                                            '#28b999', '#34495d', '#860048', '#009e7b'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                    label: {
                                        textStyle: {
                                            fontSize: 18,
                                            fontWeight: 100,
                                            // fontFamily:"Roboto"
                                        },

                                        // position: 'inner',
                                        // formatter: '{d}% ',

                                        position: 'outter',
                                        formatter: function(params) {
                                            // console.log('param ---->', params)
                                            return (params.percent - 0).toFixed(2) + '%'
                                        }
                                    }
                                },

                            }
                        }]
                    });

                    window.onresize = function() {
                        echartPieCollapse.resize();
                    };

                }



                if ($('#echart_pie').length) {

                    var echartPieMTS = echarts.init(document.getElementById('echart_pie'), theme);

                    echartPieMTS.setOption({
                        title: {
                            text: 'Average Tackle Success',
                            subtext: ''
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b} : {d}%"
                                // formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            x: 'center',
                            y: 'bottom',
                            data: ["Successful", "Unsuccessful"]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                magicType: {
                                    show: true,
                                    type: ['pie', 'funnel'],
                                    option: {
                                        funnel: {
                                            x: '25%',
                                            width: '50%',
                                            funnelAlign: 'left',
                                            max: 1548
                                        }
                                    }
                                },
                                restore: {
                                    show: true,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        calculable: true,
                        series: [{
                            // name: 'test',
                            type: 'pie',
                            radius: '60%',
                            center: ['50%', '50%'],
                            // selectedOffset: 4,
                            // data: [{
                            // value: 335,
                            // name: 'Direct Access'
                            // }, {
                            // value: 310,
                            // name: 'Deceptive'
                            // }, {
                            // value: 234,
                            // name: 'Corrective Movement'
                            // }, {
                            // value: 135,
                            // name: 'Out'
                            // }, {
                            // value: 1548,
                            // name: 'Non-Deceptive'
                            // }]
                            data: tackle_data,
                            itemStyle: {
                                normal: {
                                    label: {
                                        textStyle: {
                                            fontSize: 15,
                                        },
                                        // position: 'inner',
                                        // formatter: '{d}% ',
                                        position: 'outer',
                                        formatter: function(params) {
                                            // console.log('param ---->', params)
                                            return (params.percent - 0).toFixed(2) + '% \n'
                                        }
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        // formatter: "{b|{b}}\n{d}%",

                                    },
                                    rich: {
                                        b: {
                                            fontSize: 16,
                                            lineHeight: 33
                                        },
                                    }
                                }

                            },
                        }]
                    });

                    var dataStyle = {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    };

                    var placeHolderStyle = {
                        normal: {
                            color: 'rgba(0,0,0,0)',
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            color: 'rgba(0,0,0,0)'
                        }
                    };

                    window.onresize = function() {
                        echartPieMTS.resize();
                    };

                }

                if ($('#echart_pie4').length) {

                    var echartPieMTS = echarts.init(document.getElementById('echart_pie4'), theme);

                    echartPieMTS.setOption({
                        // title: {
                        //   text: 'Average Tackle Success',
                        // subtext: 'Hover on each section to see more details'
                        //},
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b} : {d}%"
                                // formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            x: 'center',
                            y: 'bottom',
                            data: ["38.75", "61.25"]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                magicType: {
                                    show: true,
                                    type: ['pie', 'funnel'],
                                    option: {
                                        funnel: {
                                            x: '25%',
                                            width: '50%',
                                            funnelAlign: 'left',
                                            max: 1548
                                        }
                                    }
                                },
                                restore: {
                                    show: true,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        calculable: true,
                        series: [{
                            // name: 'test',
                            type: 'pie',
                            radius: '20%',
                            center: ['50%', '60%'],
                            // selectedOffset: 4,
                            // data: [{
                            // value: 335,
                            // name: 'Direct Access'
                            // }, {
                            // value: 310,
                            // name: 'Deceptive'
                            // }, {
                            // value: 234,
                            // name: 'Corrective Movement'
                            // }, {
                            // value: 135,
                            // name: 'Out'
                            // }, {
                            // value: 1548,
                            // name: 'Non-Deceptive'
                            // }]
                            data: ["succesful", "Unsuccesful"],
                            itemStyle: {
                                normal: {
                                    label: {
                                        textStyle: {
                                            fontSize: 15,
                                        },
                                        // position: 'inner',
                                        // formatter: '{d}% ',
                                        position: 'outter',
                                        formatter: function(params) {
                                            // console.log('param ---->', params)
                                            return (params.percent - 0).toFixed(2) + '% \n' + params.name
                                        }
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        // formatter: "{b|{b}}\n{d}%",

                                    },
                                    rich: {
                                        b: {
                                            fontSize: 16,
                                            lineHeight: 33
                                        },
                                    }
                                }

                            },
                        }]
                    });

                    var dataStyle = {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    };

                    var placeHolderStyle = {
                        normal: {
                            color: 'rgba(0,0,0,0)',
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            color: 'rgba(0,0,0,0)'
                        }
                    };

                    window.onresize = function() {
                        echartPieMTS.resize();
                    };

                }

                if ($('#echart_sonar_tackle').length) {

                    var echartRadar = echarts.init(document.getElementById('echart_sonar_tackle'), theme);

                    echartRadar.setOption({
                        title: {
                            text: "Player Characteristics",
                            subtext: 'Each player has different shape\naccording to the overall performance'
                        },
                        //  tooltip: {
                        // 	trigger: 'item'
                        // },
                        // legend: {
                        //   orient: 'vertical',
                        //   x: 'right',
                        //   y: 'bottom',
                        //   data: ['Allocated Budget', 'Actual Spending']
                        // },
                        grid: {
                            left: '40%'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                restore: {
                                    show: true,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        polar: [{
                            indicator: [{
                                    text: 'Tackle Decision\nTime Efficiency',
                                    max: 100
                                }, {
                                    text: 'Tackle\nSuccess\npercentage',
                                    max: 100
                                }, {
                                    text: 'Movement\nEfficiency\npercentage',
                                    max: 100
                                }
                                // , {
                                // text: 'Customer Support',
                                // max: 38000
                                // }, {
                                // text: 'Development',
                                // max: 52000
                                // }, {
                                // text: 'Marketing',
                                // max: 25000
                                // }
                            ],
                            center: ['50%', '60%'],
                            splitNumber: 4,
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(221, 221, 221,0.9)'
                                }
                            },
                            splitArea: {
                                areaStyle: {
                                    // color: ['#f2f2f2de',
                                    // '#fff'
                                    // ]
                                }
                            }
                        }],
                        calculable: true,
                        series: [{
                            // name: 'Budget vs spending',
                            type: 'radar',
                            data: [{
                                value: solar_data,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter: function(params) {
                                            return (params.value).toFixed(2) + '%';
                                        },
                                        textStyle: {
                                            color: '#0a5170',
                                            fontSize: 6
                                        }
                                    }
                                }
                            }],
                            // [
                            // 	{
                            // value: [1100, 87, 54],
                            // name: 'Allocated Budget'
                            // }
                            // , {
                            // value: [5000, 14000, 28000],
                            // name: 'Actual Spending'
                            // }
                            // ]
                        }]
                    });

                    window.onresize = function() {
                        echartRadar.resize();
                    };

                }

                if ($('#echart_sonar_tackle2').length) {

                    var echartRadar = echarts.init(document.getElementById('echart_sonar_tackle2'), theme);

                    echartRadar.setOption({
                        title: {
                            text: "Max speed (cm/s)",
                            subtext: ' '
                        },
                        //  tooltip: {
                        // 	trigger: 'item'
                        // },
                        // legend: {
                        //   orient: 'vertical',
                        //   x: 'right',
                        //   y: 'bottom',
                        //   data: ['Allocated Budget', 'Actual Spending']
                        // },
                        grid: {
                            left: '50%'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                restore: {
                                    show: true,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        polar: [{
                            indicator: [{
                                    text: 'Alex 1',
                                    max: 100
                                }, {
                                    text: 'Alex 2',
                                    max: 100
                                }, {
                                    text: 'Alex 3',
                                    max: 100
                                }
                                // , {
                                // text: 'Customer Support',
                                // max: 38000
                                // }, {
                                // text: 'Development',
                                // max: 52000
                                // }, {
                                // text: 'Marketing',
                                // max: 25000
                                // }
                            ],
                            center: ['60%', '60%'],
                            splitNumber: 4,
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(221, 221, 221,0.9)'
                                }
                            },
                            splitArea: {
                                areaStyle: {
                                    // color: ['#f2f2f2de',
                                    // '#fff'
                                    // ]
                                }
                            }
                        }],
                        calculable: true,
                        series: [{
                            // name: 'Budget vs spending',
                            type: 'radar',
                            data: [{
                                value: solar_data,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter: function(params) {
                                            return (params.value).toFixed(2) + '%';
                                        },
                                        textStyle: {
                                            color: '#0a5170',
                                            fontSize: 11
                                        }
                                    }
                                }
                            }],
                            // [
                            // 	{
                            // value: [1100, 87, 54],
                            // name: 'Allocated Budget'
                            // }
                            // , {
                            // value: [5000, 14000, 28000],
                            // name: 'Actual Spending'
                            // }
                            // ]
                        }]
                    });

                    window.onresize = function() {
                        echartRadar.resize();
                    };

                }


                if ($('#top-trg').length) {

                    var echartRadarTop = echarts.init(document.getElementById('top-trg'), theme);

                    echartRadarTop.setOption({
                        // title: {
                        //   text: "Player's Characteristic",
                        //   subtext: 'Each player has different shape\naccording to the overall performance'
                        // },
                        radar: [{
                            indicator: [{
                                text: 'DE',
                                max: 100
                            }, {
                                text: 'TS',
                                max: 100
                            }, {
                                text: 'ME',
                                max: 100
                            }],
                            center: ['50%', '65%'],
                            splitNumber: 3,
                            name: {
                                // formatter:'{value}',
                                textStyle: {
                                    fontSize: 8,
                                    // color:'#72ACD1'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(221, 221, 221, 0.8)'
                                }
                            },
                            splitArea: {
                                areaStyle: {
                                    // color: ['#f2f2f2de',
                                    // '#fff'
                                    // ]
                                }
                            }
                        }],
                        calculable: true,
                        series: [{
                            // name: 'Budget vs spending',
                            type: 'radar',
                            data: [{
                                value: solar_data,
                                symbol: 'none',
                                // 	label: {
                                // 		normal: {
                                // 				show: true,
                                // 				formatter:function(params) {
                                // 						return (params.value).toFixed(2)+'%';
                                // 				},
                                // 				textStyle: {
                                // 					// color: 'grey',
                                // 					fontSize: 10
                                // 				}
                                // 		}
                                // }
                            }],
                            // [
                            // 	{
                            // value: [1100, 87, 54],
                            // name: 'Allocated Budget'
                            // }
                            // , {
                            // value: [5000, 14000, 28000],
                            // name: 'Actual Spending'
                            // }
                            // ]
                        }]
                    });

                    window.onresize = function() {
                        echartRadar.resize();
                    };

                }






                if ($('#echart_mini_pie_demo').length) {

                    var echartPieDecisionTime = echarts.init(document.getElementById('echart_mini_pie_demo'), theme);

                    echartPieDecisionTime.setOption({
                        title: {
                            text: 'Decision Times per trial',
                            subtext: 'Left and Right breakdown'
                        },
                        xAxis: {
                            scale: true,
                            // boundaryGap: false,
                            axisLine: {
                                // show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#afc5d0',
                                    type: 'solid'
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: 45
                            },
                            type: 'category',
                            // axisTick : {show: true},
                            // data: ['Left', 'Right']
                            data: particiapnts_sides
                        },
                        grid: { bottom: '10%' },
                        yAxis: {
                            // axisTick: false,
                            name: 'Decision time (sec)',
                            nameLocation: 'middle',
                            nameGap: 30,
                            nameTextStyle: {
                                fontSize: 11
                            },
                            scale: true,
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    type: 'dashed'
                                }
                            },
                        },
                        grid: {
                            left: 50,
                            // right: 20
                        },
                        legend: {
                            orient: 'vertical',
                            right: 10,
                            itemGap: 5,
                            borderColor: '#c5fff3',

                            data: ['L succ', 'L unsucc', 'R succ', 'R unsucc']
                        },
                        series: [
                            // 	{
                            // 	type: 'effectScatter',
                            // 	symbolSize: 20,
                            // 	data: [
                            // 		['Left', 0.96],
                            // 		['Right', 1.1]
                            // 	]
                            // }, 
                            {
                                type: 'scatter',
                                name: 'L succ',
                                itemStyle: {
                                    normal: {
                                        color: '#34485d'
                                    }
                                },
                                data: decision_time_all.left.suc,
                                // markLine: {
                                // 	symbol: false,
                                // 	data: [{
                                // 		type: 'average',
                                // 		name: '???',
                                // 		// symbol: "rect",
                                // 		symbolSize:5
                                // 	}]
                                // 	}
                            },
                            {
                                type: 'scatter',
                                name: 'R succ',
                                itemStyle: {
                                    normal: {
                                        // shadowBlur: 10,
                                        // shadowColor: 'rgba(120, 36, 50, 0.5)',
                                        // shadowOffsetY: 5,
                                        // color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                        // 		offset: 0,
                                        // 		color: 'rgb(251, 118, 123)'
                                        // }, {
                                        // 		offset: 1,
                                        // 		color: 'rgb(204, 46, 72)'
                                        // }])
                                        color: '#26b99a'
                                    }
                                },
                                // data: [['Right', 1.2], ['Right', 1.1], ['Right', .87], ['Right', .64], ['Right', .97]],
                                data: decision_time_all.right.suc,
                                // markLine: {
                                // 	symbol: false,
                                // 	data: [{
                                // 		type: 'average',
                                // 		name: '???',
                                // 		// symbol: "rect",
                                // 		symbolSize:5
                                // 	}]
                                // 	}
                            },
                            // {
                            // 	type: 'scatter',
                            // 	name: 'Right',
                            // 	itemStyle: {
                            // 		normal: {
                            // 			color: 'rgb(51, 122, 183)'
                            // 		}
                            // 	},
                            // 	data: dec_time_detail[2],

                            // },
                            {
                                type: 'scatter',
                                name: 'L unsucc',
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(52, 71, 92, 0.15)',
                                        borderColor: '#34485d',
                                        borderWidth: 2
                                    }
                                },
                                data: decision_time_all.left.unsuc,

                            },
                            {
                                type: 'scatter',
                                name: 'R unsucc',
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(38, 185, 154, 0.15)',
                                        borderColor: '#26b99a',
                                        borderWidth: 2
                                    }
                                },
                                data: decision_time_all.right.unsuc,

                            }
                        ]
                    });

                    window.onresize = function() {
                        echartPieDecisionTime.resize();
                    };

                }


                if ($('#echart_line_speed').length) {

                    var echartLineSpeed = echarts.init(document.getElementById('echart_line_speed'), theme);

                    echartLineSpeed.setOption({
                        title: {
                            text: 'Average Max Speed',
                            subtext: 'For each Side-Step'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        // legend: {
                        //   x: 220,
                        //   y: 40,
                        //   data: ['Novices', 'Experts', 'Pros']
                        // },
                        grid: {
                            left: '15%'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                // magicType: {
                                //   show: true,
                                //   title: {
                                // 	line: 'Line',
                                // 	bar: 'Bar',
                                // 	stack: 'Stack',
                                // 	tiled: 'Tiled'
                                //   },
                                //   type: ['line', 'bar', 'stack', 'tiled']
                                // },
                                restore: {
                                    show: true,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        calculable: true,
                        xAxis: [{
                            type: 'category',
                            // boundaryGap: false,
                            axisLabel: {
                                interval: 0,
                                rotate: 45
                            },
                            data: players
                        }],
                        yAxis: [{
                            name: 'Speed (cm/s)',
                            nameLocation: 'middle',
                            nameGap: 30,
                            type: 'value',
                            splitLine: {
                                show: false
                            },
                            // scale: true
                        }],
                        series: [{
                                name: 'Avg Max Speed',
                                type: 'bar',
                                barWidth: '40%',
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [15, 15, 0, 0],
                                        areaStyle: {
                                            type: 'default'
                                        }
                                    }
                                },
                                data: speed_tmp
                            },
                            // {
                            //   name: 'Experts',
                            //   type: 'line',
                            //   smooth: true,
                            //   itemStyle: {
                            // 	normal: {
                            // 	  areaStyle: {
                            // 		type: 'default'
                            // 	  }
                            // 	}
                            //   },
                            //   data: [0, 10, 30, 50, 40, 30, 10]
                            // }
                        ]
                    });

                    window.onresize = function() {
                        echartLineSpeed.resize();
                    };

                }





                if ($('#echart_fatigue').length) {

                    var echartLineFatigue = echarts.init(document.getElementById('echart_fatigue'), theme);

                    echartLineFatigue.setOption({
                        title: {
                            text: 'Tackle Fatigue',
                            subtext: 'During the test session'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        // legend: {
                        //   x: 220,
                        //   y: 40,
                        //   data: ['Novices', 'Experts', 'Pros']
                        // },
                        grid: {
                            left: '15%',
                            bottom: 80
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                // magicType: {
                                //   show: true,
                                //   title: {
                                // 	line: 'Line',
                                // 	bar: 'Bar',
                                // 	stack: 'Stack',
                                // 	tiled: 'Tiled'
                                //   },
                                //   type: ['line', 'bar', 'stack', 'tiled']
                                // },
                                restore: {
                                    show: true,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        calculable: true,
                        xAxis: [{
                            name: 'Sequence of Trials',
                            axisTick: { show: false },
                            nameLocation: 'middle',
                            nameGap: 55,
                            type: 'category',
                            // boundaryGap: false,
                            axisLabel: {
                                interval: 0,
                                rotate: 90,
                                fontSize: 7,
                                boundaryGap: true
                            },
                            splitArea: {
                                show: true,
                                areaStyle: {
                                    opacity: 0.5
                                }
                            },
                            data: fatigue_lable
                        }],
                        yAxis: [{
                            name: 'Tackle success',
                            nameLocation: 'middle',
                            nameGap: 30,
                            type: 'category',
                            // scale: true,
                            data: [0, 1],
                            // ascending: true,
                            // boundaryGap:false
                        }],
                        series: [{
                                name: 'Step Start',
                                type: 'line',
                                smooth: true,
                                // symbol: 'arrow',
                                // step: 'start',
                                data: fatigue_data,
                                itemStyle: {
                                    normal: {
                                        lineCap: 'square'
                                    }
                                }
                            }
                            // {
                            //   name: 'Experts',
                            //   type: 'line',
                            //   smooth: true,
                            //   itemStyle: {
                            // 	normal: {
                            // 	  areaStyle: {
                            // 		type: 'default'
                            // 	  }
                            // 	}
                            //   },
                            //   data: [0, 10, 30, 50, 40, 30, 10]
                            // }
                        ]
                    });


                }




                if ($('#echart_tackle_success_p').length) {

                    var echartTCS_p = echarts.init(document.getElementById('echart_tackle_success_p'), theme);

                    echartTCS_p.setOption({
                        title: {
                            text: 'Average Tackle Success',
                            subtext: 'For each Side-Step'
                        },
                        tooltip: {
                            trigger: 'axis',
                            // formatter: "{b} : {d}%",
                            axisPointer: {
                                type: 'shadow' //'line' | 'shadow'
                            }
                        },
                        legend: {
                            orient: 'vertical',
                            right: 10,
                            data: ['Left', 'Right']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '9%',
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'value',
                            max: 100,
                            min: -100,
                            splitNumber: 10,
                            // boundaryGap:['10%','10%'],
                            offset: 5,
                            name: 'Tackle success',
                            nameLocation: 'middle',
                            nameGap: 30,
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                formatter: function(params) {
                                    return Math.abs(params) + "%"
                                }
                            }
                        }],
                        yAxis: [{
                            type: 'category',
                            axisTick: { show: false },
                            inverse: true,
                            axisLabel: {
                                margin: 30
                            },
                            // data : ['Trial 1','Trial 2','Trial 3','Trial 4','Trial 5','Trial 6','Trial 7']
                            // data: participants.reverse()
                            data: particiapnts_sides
                        }],
                        series: [{
                                name: 'Right',
                                type: 'bar',
                                barWidth: '50%',
                                stack: 'total',
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [0, 15, 15, 0],
                                    }
                                },
                                // label: {
                                // 		normal: {
                                // 				show: true
                                // 		}
                                // },
                                data: tackle_sucess_avg.right,
                                label: {
                                    normal: {
                                        show: true,
                                        // position: 'right',
                                        formatter: function(params) {
                                            if (params.value[0] == 0) return ""
                                            return (params.value[0] * 1).toFixed(0) + '%'
                                        }
                                    }
                                },
                                // data:[0.66, 0.87, 0.97, 1.1, 0.5, 1.2, 1.5]
                                // data: dec_time_r.reverse()

                            },
                            {
                                name: 'Left',
                                type: 'bar',
                                barWidth: '50%',
                                stack: 'total',
                                label: {
                                    normal: {
                                        show: true,
                                        // position: 'left',
                                        formatter: function(params) {
                                            if (params.value[0] == 0) return ""
                                            return (params.value[0] * -1).toFixed(0) + '%'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [15, 0, 0, 15],
                                    }
                                },
                                // data:[-0.5, -0.8, -0.6, -0.99, -1.5, -0.4, -0.5]
                                // data: dec_time_l.reverse()
                                data: tackle_sucess_avg.left
                            }
                        ]
                    });

                    window.onresize = function() {
                        echartPieSc.resize();
                    };

                }







                if ($('#dec_scatterplot').length) {

                    var echartPieSc = echarts.init(document.getElementById('dec_scatterplot'), theme);

                    echartPieSc.setOption({
                        title: {
                            text: 'Average Decision Time',
                            subtext: 'Left/Right decision time breakdown'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow' //'line' | 'shadow'
                            }
                        },
                        legend: {
                            orient: 'vertical',
                            right: 10,
                            data: ['Left', 'Right']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '9%',
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'value',
                            max: 2,
                            min: -2,
                            name: 'Decision Time for left and right (sec)',
                            nameLocation: 'middle',
                            nameGap: 30,
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                formatter: function(params) {
                                    return Math.abs(params)
                                }
                            }
                        }],
                        yAxis: [{
                            type: 'category',
                            axisTick: { show: false },
                            inverse: true,
                            // data : ['Trial 1','Trial 2','Trial 3','Trial 4','Trial 5','Trial 6','Trial 7']
                            // data: participants.reverse()
                            data: particiapnts_sides
                        }],
                        series: [{
                                name: 'Right',
                                type: 'bar',
                                barWidth: '50%',
                                stack: 'total',
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [0, 15, 15, 0],
                                    }
                                },
                                // label: {
                                // 		normal: {
                                // 				show: true
                                // 		}
                                // },
                                data: dec_time_avg.right,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right',
                                        formatter: function(params) {
                                            if (params.value[0] == 0) return ""
                                            return (params.value[0] * 1).toFixed(2) + ' sec'
                                        }
                                    }
                                },
                                // data:[0.66, 0.87, 0.97, 1.1, 0.5, 1.2, 1.5]
                                // data: dec_time_r.reverse()

                            },
                            {
                                name: 'Left',
                                type: 'bar',
                                barWidth: '50%',
                                stack: 'total',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'left',
                                        formatter: function(params) {
                                            if (params.value[0] == 0) return ""
                                            return (params.value[0] * -1).toFixed(2) + ' sec'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [15, 0, 0, 15],
                                    }
                                },
                                // data:[-0.5, -0.8, -0.6, -0.99, -1.5, -0.4, -0.5]
                                // data: dec_time_l.reverse()
                                data: dec_time_avg.left
                            }
                        ]
                    });

                    window.onresize = function() {
                        echartPieSc.resize();
                    };

                }




                window.onresize = function() {
                    echartLineFatigue.resize();
                    echartPieSc.resize();
                    echartLineSpeed.resize();
                    echartPieDecisionTime.resize();
                    echartRadar.resize();
                    echartPieMTS.resize();
                    echartPieCollapse.resize();
                    echartPieCollapseOTB.resize();
                    echartBarDistC.resize();
                    // echartBarMDC.resize();
                    echartBarMD.resize();
                    echartTCS_p.resize();
                };







            }
        });

    } //end of function





    // var myloc = window.location.href;
    // var locarray = myloc.split("/");
    // delete locarray[(locarray.length - 1)];
    // var arraytext = locarray.join("/");

    // console.log(arraytext);

    // function readTextFile(file) {
    // 	var rawFile = new XMLHttpRequest();
    // 	rawFile.open("GET", file, false);
    // 	rawFile.onreadystatechange = function () {
    // 		if (rawFile.readyState === 4) {
    // 			if (rawFile.status === 200 || rawFile.status == 0) {
    // 				var allText = rawFile.responseText;
    // 				alert(allText);
    // 			}
    // 		}
    // 	}
    // 	rawFile.send(null);
    // }







    //echart Radar

    // if ($('#echart_sonar').length ){ 

    //   var echartRadar_speed = echarts.init(document.getElementById('echart_sonar'), theme);

    //   echartRadar_speed.setOption({
    // 	title: {
    // 	  text: 'Speed',
    //               subtext: '(cm/s)'
    // 	},
    // 	 tooltip: {
    // 		trigger: 'item'
    // 	},
    // 	legend: {
    // 	  orient: 'vertical',
    // 	  x: 'right',
    // 	  y: 'bottom',
    // 	  data: ['Max Speed']
    // 	},
    // 	toolbox: {
    // 	  show: true,
    // 	  feature: {
    // 		restore: {
    // 		  show: true,
    // 		  title: "Restore"
    // 		},
    // 		saveAsImage: {
    // 		  show: true,
    // 		  title: "Save Image"
    // 		}
    // 	  }
    // 	},
    // 	polar: [{
    // 	  indicator: [{
    // 		text: 'Alex 1',
    // 		max: 202
    // 	  }, {
    // 		text: 'Alex 2',
    // 		max: 202
    // 	  }, {
    // 		text: 'Alex 3',
    // 		max: 202
    // 	  }, {
    // 		text: 'Alex 4',
    // 		max: 202
    // 	  }, {
    // 		text: 'Jean 1',
    // 		max: 202
    // 	  }, {
    // 		text: 'Jean 2',
    // 		max: 202
    //             }, {
    //               text: 'Louis',
    //               max: 202
    //             }, /*{
    //               text: 'Trial 8',
    //               max: 250
    //                 }*/
    //             ]
    // 	}],
    // 	calculable: true,
    // 	series: [{
    // 	  name: 'Max speed',
    //               type: 'radar',
    //               data: [{
    //                   value: solar_data_speed,
    //                   // value: [150, 120, 170, 90, 145, 190, 160],
    // 		  name: 'Max speeds'
    // 	  }]
    // 	}]
    //   });

    // } 

    //echart Funnel

    if ($('#echart_pyramid').length) {

        var echartFunnel = echarts.init(document.getElementById('echart_pyramid'), theme);

        echartFunnel.setOption({
            title: {
                text: 'Echart Pyramid Graph',
                subtext: 'Subtitle'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            legend: {
                data: ['Something #1', 'Something #2', 'Something #3', 'Something #4', 'Something #5'],
                orient: 'vertical',
                x: 'left',
                y: 'bottom'
            },
            calculable: true,
            series: [{
                name: '漏斗图',
                type: 'funnel',
                width: '40%',
                data: [{
                    value: 60,
                    name: 'Something #1'
                }, {
                    value: 40,
                    name: 'Something #2'
                }, {
                    value: 20,
                    name: 'Something #3'
                }, {
                    value: 80,
                    name: 'Something #4'
                }, {
                    value: 100,
                    name: 'Something #5'
                }]
            }]
        });

    }

    //echart Gauge

    if ($('#echart_gauge').length) {

        var echartGauge = echarts.init(document.getElementById('echart_gauge'), theme);

        echartGauge.setOption({
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: 'Performance',
                type: 'gauge',
                center: ['50%', '50%'],
                startAngle: 140,
                endAngle: -140,
                min: 0,
                max: 100,
                precision: 0,
                splitNumber: 10,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [
                            [0.2, '#087E65'],
                            [0.4, '#26B99A'],
                            [0.8, '#CBEAE3'],
                            [1, '#e03838']
                        ],
                        width: 30
                    }
                },
                axisTick: {
                    show: true,
                    splitNumber: 5,
                    length: 8,
                    lineStyle: {
                        color: '#eee',
                        width: 1,
                        type: 'solid'
                    }
                },
                axisLabel: {
                    show: true,
                    formatter: function(v) {
                        switch (v + '') {
                            case '10':
                                return '60';
                            case '30':
                                return '120';
                            case '60':
                                return '200';
                            case '90':
                                return '250';
                            default:
                                return '';
                        }
                    },
                    textStyle: {
                        color: '#333'
                    }
                },
                splitLine: {
                    show: true,
                    length: 30,
                    lineStyle: {
                        color: '#eee',
                        width: 2,
                        type: 'solid'
                    }
                },
                pointer: {
                    length: '80%',
                    width: 8,
                    color: 'auto'
                },
                title: {
                    show: true,
                    offsetCenter: ['-65%', -10],
                    textStyle: {
                        color: '#333',
                        fontSize: 15
                    }
                },
                detail: {
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc',
                    width: 100,
                    height: 40,
                    offsetCenter: ['-60%', 10],
                    formatter: '{value}%',
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    }
                },
                data: [{
                    value: 70,
                    name: 'Performance'
                }]
            }]
        });

    }

    //echart Line

    if ($('#echart_line').length) {

        var echartLine = echarts.init(document.getElementById('echart_line'), theme);

        echartLine.setOption({
            title: {
                text: 'Movement initiation',
                // subtext: 'Subtitle'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 40,
                data: ['Novices', 'Experts', 'Pros']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar',
                            stack: 'Stack',
                            tiled: 'Tiled'
                        },
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: ['0s', '0.3s', '0.6s', '0.9s', '1.2s', '1.5s', '1.8s']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'Pros',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [0, 5, 21, 54, 44, 40, 5]
            }, {
                name: 'Experts',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [0, 10, 30, 50, 40, 30, 10]
            }, {
                name: 'Novices',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [60, 80, 75, 71, 66, 60, 20]
            }]
        });

    }

    //echart Scatter

    if ($('#echart_scatter').length) {

        var echartScatter = echarts.init(document.getElementById('echart_scatter'), theme);

        echartScatter.setOption({
            title: {
                text: 'Distribution',
                // subtext: 'Heinz  2003'
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                axisPointer: {
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            legend: {
                data: ['Data2', 'Data1']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            xAxis: [{
                type: 'value',
                scale: true,
                axisLabel: {
                    formatter: '{value} cm/s'
                }
            }],
            yAxis: [{
                type: 'value',
                scale: true,
                axisLabel: {
                    formatter: '{value} cm'
                }
            }],
            series: [{
                name: 'Data1',
                type: 'scatter',
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        if (params.value.length > 1) {
                            return params.seriesName + ' :<br/>' + params.value[0] + 'cm ' + params.value[1] + 'kg ';
                        } else {
                            return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kg ';
                        }
                    }
                },
                data: [
                    [161.2, 51.6],
                    [167.5, 59.0],
                    [159.5, 49.2],
                    [157.0, 63.0],
                    [155.8, 53.6],
                    [170.0, 59.0],
                    [159.1, 47.6],
                    [166.0, 69.8],
                    [176.2, 66.8],
                    [160.2, 75.2],
                    [172.5, 55.2],
                    [170.9, 54.2],
                    [172.9, 62.5],
                    [153.4, 42.0],
                    [160.0, 50.0],
                    [147.2, 49.8],
                    [168.2, 49.2],
                    [175.0, 73.2],
                    [157.0, 47.8],
                    [167.6, 68.8],
                    [159.5, 50.6],
                    [175.0, 82.5],
                    [166.8, 57.2],
                    [176.5, 87.8],
                    [170.2, 72.8],
                    [174.0, 54.5],
                    [173.0, 59.8],
                    [179.9, 67.3],
                    [170.5, 67.8],
                    [160.0, 47.0],
                    [154.4, 46.2],
                    [162.0, 55.0],
                    [176.5, 83.0],
                    [160.0, 54.4],
                    [152.0, 45.8],
                    [162.1, 53.6],
                    [170.0, 73.2],
                    [160.2, 52.1],
                    [161.3, 67.9],
                    [166.4, 56.6],
                    [168.9, 62.3],
                    [163.8, 58.5],
                    [167.6, 54.5],
                    [160.0, 50.2],
                    [161.3, 60.3],
                    [167.6, 58.3],
                    [165.1, 56.2],
                    [160.0, 50.2],
                    [170.0, 72.9],
                    [157.5, 59.8],
                    [167.6, 61.0],
                    [160.7, 69.1],
                    [163.2, 55.9],
                    [152.4, 46.5],
                    [157.5, 54.3],
                    [168.3, 54.8],
                    [180.3, 60.7],
                    [165.5, 60.0],
                    [165.0, 62.0],
                    [164.5, 60.3],
                    [156.0, 52.7],
                    [160.0, 74.3],
                    [163.0, 62.0],
                    [165.7, 73.1],
                    [161.0, 80.0],
                    [162.0, 54.7],
                    [166.0, 53.2],
                    [174.0, 75.7],
                    [172.7, 61.1],
                    [167.6, 55.7],
                    [151.1, 48.7],
                    [164.5, 52.3],
                    [163.5, 50.0],
                    [152.0, 59.3],
                    [169.0, 62.5],
                    [164.0, 55.7],
                    [161.2, 54.8],
                    [155.0, 45.9],
                    [170.0, 70.6],
                    [176.2, 67.2],
                    [170.0, 69.4],
                    [162.5, 58.2],
                    [170.3, 64.8],
                    [164.1, 71.6],
                    [169.5, 52.8],
                    [163.2, 59.8],
                    [154.5, 49.0],
                    [159.8, 50.0],
                    [173.2, 69.2],
                    [170.0, 55.9],
                    [161.4, 63.4],
                    [169.0, 58.2],
                    [166.2, 58.6],
                    [159.4, 45.7],
                    [162.5, 52.2],
                    [159.0, 48.6],
                    [162.8, 57.8],
                    [159.0, 55.6],
                    [179.8, 66.8],
                    [162.9, 59.4],
                    [161.0, 53.6],
                    [151.1, 73.2],
                    [168.2, 53.4],
                    [168.9, 69.0],
                    [173.2, 58.4],
                    [171.8, 56.2],
                    [178.0, 70.6],
                    [164.3, 59.8],
                    [163.0, 72.0],
                    [168.5, 65.2],
                    [166.8, 56.6],
                    [172.7, 105.2],
                    [163.5, 51.8],
                    [169.4, 63.4],
                    [167.8, 59.0],
                    [159.5, 47.6],
                    [167.6, 63.0],
                    [161.2, 55.2],
                    [160.0, 45.0],
                    [163.2, 54.0],
                    [162.2, 50.2],
                    [161.3, 60.2],
                    [149.5, 44.8],
                    [157.5, 58.8],
                    [163.2, 56.4],
                    [172.7, 62.0],
                    [155.0, 49.2],
                    [156.5, 67.2],
                    [164.0, 53.8],
                    [160.9, 54.4],
                    [162.8, 58.0],
                    [167.0, 59.8],
                    [160.0, 54.8],
                    [160.0, 43.2],
                    [168.9, 60.5],
                    [158.2, 46.4],
                    [156.0, 64.4],
                    [160.0, 48.8],
                    [167.1, 62.2],
                    [158.0, 55.5],
                    [167.6, 57.8],
                    [156.0, 54.6],
                    [162.1, 59.2],
                    [173.4, 52.7],
                    [159.8, 53.2],
                    [170.5, 64.5],
                    [159.2, 51.8],
                    [157.5, 56.0],
                    [161.3, 63.6],
                    [162.6, 63.2],
                    [160.0, 59.5],
                    [168.9, 56.8],
                    [165.1, 64.1],
                    [162.6, 50.0],
                    [165.1, 72.3],
                    [166.4, 55.0],
                    [160.0, 55.9],
                    [152.4, 60.4],
                    [170.2, 69.1],
                    [162.6, 84.5],
                    [170.2, 55.9],
                    [158.8, 55.5],
                    [172.7, 69.5],
                    [167.6, 76.4],
                    [162.6, 61.4],
                    [167.6, 65.9],
                    [156.2, 58.6],
                    [175.2, 66.8],
                    [172.1, 56.6],
                    [162.6, 58.6],
                    [160.0, 55.9],
                    [165.1, 59.1],
                    [182.9, 81.8],
                    [166.4, 70.7],
                    [165.1, 56.8],
                    [177.8, 60.0],
                    [165.1, 58.2],
                    [175.3, 72.7],
                    [154.9, 54.1],
                    [158.8, 49.1],
                    [172.7, 75.9],
                    [168.9, 55.0],
                    [161.3, 57.3],
                    [167.6, 55.0],
                    [165.1, 65.5],
                    [175.3, 65.5],
                    [157.5, 48.6],
                    [163.8, 58.6],
                    [167.6, 63.6],
                    [165.1, 55.2],
                    [165.1, 62.7],
                    [168.9, 56.6],
                    [162.6, 53.9],
                    [164.5, 63.2],
                    [176.5, 73.6],
                    [168.9, 62.0],
                    [175.3, 63.6],
                    [159.4, 53.2],
                    [160.0, 53.4],
                    [170.2, 55.0],
                    [162.6, 70.5],
                    [167.6, 54.5],
                    [162.6, 54.5],
                    [160.7, 55.9],
                    [160.0, 59.0],
                    [157.5, 63.6],
                    [162.6, 54.5],
                    [152.4, 47.3],
                    [170.2, 67.7],
                    [165.1, 80.9],
                    [172.7, 70.5],
                    [165.1, 60.9],
                    [170.2, 63.6],
                    [170.2, 54.5],
                    [170.2, 59.1],
                    [161.3, 70.5],
                    [167.6, 52.7],
                    [167.6, 62.7],
                    [165.1, 86.3],
                    [162.6, 66.4],
                    [152.4, 67.3],
                    [168.9, 63.0],
                    [170.2, 73.6],
                    [175.2, 62.3],
                    [175.2, 57.7],
                    [160.0, 55.4],
                    [165.1, 104.1],
                    [174.0, 55.5],
                    [170.2, 77.3],
                    [160.0, 80.5],
                    [167.6, 64.5],
                    [167.6, 72.3],
                    [167.6, 61.4],
                    [154.9, 58.2],
                    [162.6, 81.8],
                    [175.3, 63.6],
                    [171.4, 53.4],
                    [157.5, 54.5],
                    [165.1, 53.6],
                    [160.0, 60.0],
                    [174.0, 73.6],
                    [162.6, 61.4],
                    [174.0, 55.5],
                    [162.6, 63.6],
                    [161.3, 60.9],
                    [156.2, 60.0],
                    [149.9, 46.8],
                    [169.5, 57.3],
                    [160.0, 64.1],
                    [175.3, 63.6],
                    [169.5, 67.3],
                    [160.0, 75.5],
                    [172.7, 68.2],
                    [162.6, 61.4],
                    [157.5, 76.8],
                    [176.5, 71.8],
                    [164.4, 55.5],
                    [160.7, 48.6],
                    [174.0, 66.4],
                    [163.8, 67.3]
                ],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: 'Max'
                    }, {
                        type: 'min',
                        name: 'Min'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'Mean'
                    }]
                }
            }, {
                name: 'Data2',
                type: 'scatter',
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        if (params.value.length > 1) {
                            return params.seriesName + ' :<br/>' + params.value[0] + 'cm ' + params.value[1] + 'kg ';
                        } else {
                            return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kg ';
                        }
                    }
                },
                data: [
                    [174.0, 65.6],
                    [175.3, 71.8],
                    [193.5, 80.7],
                    [186.5, 72.6],
                    [187.2, 78.8],
                    [181.5, 74.8],
                    [184.0, 86.4],
                    [184.5, 78.4],
                    [175.0, 62.0],
                    [184.0, 81.6],
                    [180.0, 76.6],
                    [177.8, 83.6],
                    [192.0, 90.0],
                    [176.0, 74.6],
                    [174.0, 71.0],
                    [184.0, 79.6],
                    [192.7, 93.8],
                    [171.5, 70.0],
                    [173.0, 72.4],
                    [176.0, 85.9],
                    [176.0, 78.8],
                    [180.5, 77.8],
                    [172.7, 66.2],
                    [176.0, 86.4],
                    [173.5, 81.8],
                    [178.0, 89.6],
                    [180.3, 82.8],
                    [180.3, 76.4],
                    [164.5, 63.2],
                    [173.0, 60.9],
                    [183.5, 74.8],
                    [175.5, 70.0],
                    [188.0, 72.4],
                    [189.2, 84.1],
                    [172.8, 69.1],
                    [170.0, 59.5],
                    [182.0, 67.2],
                    [170.0, 61.3],
                    [177.8, 68.6],
                    [184.2, 80.1],
                    [186.7, 87.8],
                    [171.4, 84.7],
                    [172.7, 73.4],
                    [175.3, 72.1],
                    [180.3, 82.6],
                    [182.9, 88.7],
                    [188.0, 84.1],
                    [177.2, 94.1],
                    [172.1, 74.9],
                    [167.0, 59.1],
                    [169.5, 75.6],
                    [174.0, 86.2],
                    [172.7, 75.3],
                    [182.2, 87.1],
                    [164.1, 55.2],
                    [163.0, 57.0],
                    [171.5, 61.4],
                    [184.2, 76.8],
                    [174.0, 86.8],
                    [174.0, 72.2],
                    [177.0, 71.6],
                    [186.0, 84.8],
                    [167.0, 68.2],
                    [171.8, 66.1],
                    [182.0, 72.0],
                    [167.0, 64.6],
                    [177.8, 74.8],
                    [164.5, 70.0],
                    [192.0, 101.6],
                    [175.5, 63.2],
                    [171.2, 79.1],
                    [181.6, 78.9],
                    [167.4, 67.7],
                    [181.1, 66.0],
                    [177.0, 68.2],
                    [174.5, 63.9],
                    [177.5, 72.0],
                    [170.5, 56.8],
                    [182.4, 74.5],
                    [197.1, 90.9],
                    [180.1, 93.0],
                    [175.5, 80.9],
                    [180.6, 72.7],
                    [184.4, 68.0],
                    [175.5, 70.9],
                    [180.6, 72.5],
                    [177.0, 72.5],
                    [177.1, 83.4],
                    [181.6, 75.5],
                    [176.5, 73.0],
                    [175.0, 70.2],
                    [174.0, 73.4],
                    [165.1, 70.5],
                    [177.0, 68.9],
                    [192.0, 102.3],
                    [176.5, 68.4],
                    [169.4, 65.9],
                    [182.1, 75.7],
                    [179.8, 84.5],
                    [175.3, 87.7],
                    [184.9, 86.4],
                    [177.3, 73.2],
                    [167.4, 53.9],
                    [178.1, 72.0],
                    [168.9, 55.5],
                    [157.2, 58.4],
                    [180.3, 83.2],
                    [170.2, 72.7],
                    [177.8, 64.1],
                    [172.7, 72.3],
                    [165.1, 65.0],
                    [186.7, 86.4],
                    [165.1, 65.0],
                    [174.0, 88.6],
                    [175.3, 84.1],
                    [185.4, 66.8],
                    [177.8, 75.5],
                    [180.3, 93.2],
                    [180.3, 82.7],
                    [177.8, 58.0],
                    [177.8, 79.5],
                    [177.8, 78.6],
                    [177.8, 71.8],
                    [177.8, 116.4],
                    [163.8, 72.2],
                    [188.0, 83.6],
                    [198.1, 85.5],
                    [175.3, 90.9],
                    [166.4, 85.9],
                    [190.5, 89.1],
                    [166.4, 75.0],
                    [177.8, 77.7],
                    [179.7, 86.4],
                    [172.7, 90.9],
                    [190.5, 73.6],
                    [185.4, 76.4],
                    [168.9, 69.1],
                    [167.6, 84.5],
                    [175.3, 64.5],
                    [170.2, 69.1],
                    [190.5, 108.6],
                    [177.8, 86.4],
                    [190.5, 80.9],
                    [177.8, 87.7],
                    [184.2, 94.5],
                    [176.5, 80.2],
                    [177.8, 72.0],
                    [180.3, 71.4],
                    [171.4, 72.7],
                    [172.7, 84.1],
                    [172.7, 76.8],
                    [177.8, 63.6],
                    [177.8, 80.9],
                    [182.9, 80.9],
                    [170.2, 85.5],
                    [167.6, 68.6],
                    [175.3, 67.7],
                    [165.1, 66.4],
                    [185.4, 102.3],
                    [181.6, 70.5],
                    [172.7, 95.9],
                    [190.5, 84.1],
                    [179.1, 87.3],
                    [175.3, 71.8],
                    [170.2, 65.9],
                    [193.0, 95.9],
                    [171.4, 91.4],
                    [177.8, 81.8],
                    [177.8, 96.8],
                    [167.6, 69.1],
                    [167.6, 82.7],
                    [180.3, 75.5],
                    [182.9, 79.5],
                    [176.5, 73.6],
                    [186.7, 91.8],
                    [188.0, 84.1],
                    [188.0, 85.9],
                    [177.8, 81.8],
                    [174.0, 82.5],
                    [177.8, 80.5],
                    [171.4, 70.0],
                    [185.4, 81.8],
                    [185.4, 84.1],
                    [188.0, 90.5],
                    [188.0, 91.4],
                    [182.9, 89.1],
                    [176.5, 85.0],
                    [175.3, 69.1],
                    [175.3, 73.6],
                    [188.0, 80.5],
                    [188.0, 82.7],
                    [175.3, 86.4],
                    [170.5, 67.7],
                    [179.1, 92.7],
                    [177.8, 93.6],
                    [175.3, 70.9],
                    [182.9, 75.0],
                    [170.8, 93.2],
                    [188.0, 93.2],
                    [180.3, 77.7],
                    [177.8, 61.4],
                    [185.4, 94.1],
                    [168.9, 75.0],
                    [185.4, 83.6],
                    [180.3, 85.5],
                    [174.0, 73.9],
                    [167.6, 66.8],
                    [182.9, 87.3],
                    [160.0, 72.3],
                    [180.3, 88.6],
                    [167.6, 75.5],
                    [186.7, 101.4],
                    [175.3, 91.1],
                    [175.3, 67.3],
                    [175.9, 77.7],
                    [175.3, 81.8],
                    [179.1, 75.5],
                    [181.6, 84.5],
                    [177.8, 76.6],
                    [182.9, 85.0],
                    [177.8, 102.5],
                    [184.2, 77.3],
                    [179.1, 71.8],
                    [176.5, 87.9],
                    [188.0, 94.3],
                    [174.0, 70.9],
                    [167.6, 64.5],
                    [170.2, 77.3],
                    [167.6, 72.3],
                    [188.0, 87.3],
                    [174.0, 80.0],
                    [176.5, 82.3],
                    [180.3, 73.6],
                    [167.6, 74.1],
                    [188.0, 85.9],
                    [180.3, 73.2],
                    [167.6, 76.3],
                    [183.0, 65.9],
                    [183.0, 90.9],
                    [179.1, 89.1],
                    [170.2, 62.3],
                    [177.8, 82.7],
                    [179.1, 79.1],
                    [190.5, 98.2],
                    [177.8, 84.1],
                    [180.3, 83.2],
                    [180.3, 83.2]
                ],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: 'Max'
                    }, {
                        type: 'min',
                        name: 'Min'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'Mean'
                    }]
                }
            }]
        });

    }

    //echart Bar Horizontal

    if ($('#echart_bar_horizontal').length) {

        var echartBar = echarts.init(document.getElementById('echart_bar_horizontal'), theme);

        echartBar.setOption({
            // title: {
            //   text: 'Bar Graph',
            //   subtext: 'Graph subtitle'
            // },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                // x: 100,
                // right: 10,
                data: ['2015', '2016']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'value',
                boundaryGap: [0, 0.01]
            }],
            yAxis: [{
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            }],
            series: [{
                name: '2015',
                type: 'bar',
                data: [18203, 23489, 29034, 104970, 131744, 630230]
            }, {
                name: '2016',
                type: 'bar',
                data: [19325, 23438, 31000, 121594, 134141, 681807]
            }]
        });

    }

    //echart Pie Collapse

    // if ($('#echart_pie2').length ){ 

    //   var echartPieCollapse = echarts.init(document.getElementById('echart_pie2'), theme);

    //   echartPieCollapse.setOption({
    // 	tooltip: {
    // 	  trigger: 'item',
    // 	  formatter: "{a} <br/>{b} : {c} ({d}%)"
    // 	},
    // 	legend: {
    // 	  x: 'center',
    // 	  y: 'bottom',
    // 	  data: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6']
    // 	},
    // 	toolbox: {
    // 	  show: true,
    // 	  feature: {
    // 		magicType: {
    // 		  show: true,
    // 		  type: ['pie', 'funnel']
    // 		},
    // 		restore: {
    // 		  show: true,
    // 		  title: "Restore"
    // 		},
    // 		saveAsImage: {
    // 		  show: true,
    // 		  title: "Save Image"
    // 		}
    // 	  }
    // 	},
    // 	calculable: true,
    // 	series: [{
    // 	  name: 'Area Mode',
    // 	  type: 'pie',
    // 	  radius: [25, 90],
    // 	  center: ['50%', 170],
    // 	  roseType: 'area',
    // 	  x: '50%',
    // 	  max: 40,
    // 	  sort: 'ascending',
    // 	  data: [{
    // 		value: 10,
    // 		name: 'Player1'
    // 	  }, {
    // 		value: 5,
    // 		name: 'Player2'
    // 	  }, {
    // 		value: 15,
    // 		name: 'Player3'
    // 	  }, {
    // 		value: 25,
    // 		name: 'Player4'
    // 	  }, {
    // 		value: 20,
    // 		name: 'Player5'
    // 	  }, {
    // 		value: 35,
    // 		name: 'Player6'
    // 	  }]
    // 	}]
    //   });

    // } 

    //echart Donut

    // if ($('#echart_donut').length ){  

    //   var echartDonut = echarts.init(document.getElementById('echart_donut'), theme);

    //   echartDonut.setOption({
    // 	tooltip: {
    // 	  trigger: 'item',
    // 	  formatter: "{a} <br/>{b} : {c} ({d}%)"
    // 	},
    // 	calculable: true,
    // 	legend: {
    // 	  x: 'center',
    // 	  y: 'bottom',
    // 	  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
    // 	},
    // 	toolbox: {
    // 	  show: true,
    // 	  feature: {
    // 		magicType: {
    // 		  show: true,
    // 		  type: ['pie', 'funnel'],
    // 		  option: {
    // 			funnel: {
    // 			  x: '25%',
    // 			  width: '50%',
    // 			  funnelAlign: 'center',
    // 			  max: 1548
    // 			}
    // 		  }
    // 		},
    // 		restore: {
    // 		  show: true,
    // 		  title: "Restore"
    // 		},
    // 		saveAsImage: {
    // 		  show: true,
    // 		  title: "Save Image"
    // 		}
    // 	  }
    // 	},
    // 	series: [{
    // 	  name: 'Access to the resource',
    // 	  type: 'pie',
    // 	  radius: ['35%', '55%'],
    // 	  itemStyle: {
    // 		normal: {
    // 		  label: {
    // 			show: true
    // 		  },
    // 		  labelLine: {
    // 			show: true
    // 		  }
    // 		},
    // 		emphasis: {
    // 		  label: {
    // 			show: true,
    // 			position: 'center',
    // 			textStyle: {
    // 			  fontSize: '14',
    // 			  fontWeight: 'normal'
    // 			}
    // 		  }
    // 		}
    // 	  },
    // 	  data: [{
    // 		value: 335,
    // 		name: 'Direct Access'
    // 	  }, {
    // 		value: 310,
    // 		name: 'E-mail Marketing'
    // 	  }, {
    // 		value: 234,
    // 		name: 'Union Ad'
    // 	  }, {
    // 		value: 135,
    // 		name: 'Video Ads'
    // 	  }, {
    // 		value: 1548,
    // 		name: 'Search Engine'
    // 	  }]
    // 	}]
    //   });

    // } 

    //echart Pie

    if ($('#echart_pie7').length) {

        var echartPie = echarts.init(document.getElementById('echart_pie'), theme);

        echartPie.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['Unsuccessful', 'Successful']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            series: [{
                name: 'test',
                type: 'pie',
                radius: '55%',
                center: ['50%', '48%'],
                data: [{
                    value: 61.25,
                    name: 'Unsuccessful tackle'
                }, {
                    value: 38.75,
                    name: 'Successful'
                }]
            }]
        });

        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }
        };

        var placeHolderStyle = {
            normal: {
                color: 'rgba(0,0,0,0)',
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };

    }

    //echart Mini Pie

    if ($('#echart_mini_pie').length) {

        var echartMiniPie = echarts.init(document.getElementById('echart_mini_pie'), theme);

        echartMiniPie.setOption({
            title: {
                // text: 'Chart #2',
                subtext: 'Overall',
                // sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    // fontFamily: '',
                    fontSize: 35,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                show: true,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 170,
                y: 45,
                itemGap: 12,
                data: ['68% Left', '78% Right', '73% Overall'],
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        title: "Text View",
                        lang: [
                            "Text View",
                            "Close",
                            "Refresh",
                        ],
                        readOnly: false
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: '1',
                type: 'pie',
                clockWise: false,
                radius: [105, 130],
                itemStyle: dataStyle,
                data: [{
                    value: 68,
                    name: '68% Left'
                }, {
                    value: 32,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }, {
                name: '2',
                type: 'pie',
                clockWise: false,
                radius: [80, 105],
                itemStyle: dataStyle,
                data: [{
                    value: 78,
                    name: '78% Right'
                }, {
                    value: 28,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }, {
                name: '3',
                type: 'pie',
                clockWise: false,
                radius: [25, 80],
                itemStyle: dataStyle,
                data: [{
                    value: 73,
                    name: '73% Overall'
                }, {
                    value: 27,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }]
        });

    }

    //echart Map

    if ($('#echart_world_map').length) {

        var echartMap = echarts.init(document.getElementById('echart_world_map'), theme);


        echartMap.setOption({
            title: {
                text: 'World Population (2010)',
                subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
                x: 'center',
                y: 'top'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
                    return params.seriesName + '<br/>' + params.name + ' : ' + value;
                }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        title: "Text View",
                        lang: [
                            "Text View",
                            "Close",
                            "Refresh",
                        ],
                        readOnly: false
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            dataRange: {
                min: 0,
                max: 1000000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                color: ['#087E65', '#26B99A', '#CBEAE3']
            },
            series: [{
                name: 'World Population (2010)',
                type: 'map',
                mapType: 'world',
                roam: false,
                mapLocation: {
                    y: 60
                },
                itemStyle: {
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: [{
                    name: 'Afghanistan',
                    value: 28397.812
                }, {
                    name: 'Angola',
                    value: 19549.124
                }, {
                    name: 'Albania',
                    value: 3150.143
                }, {
                    name: 'United Arab Emirates',
                    value: 8441.537
                }, {
                    name: 'Argentina',
                    value: 40374.224
                }, {
                    name: 'Armenia',
                    value: 2963.496
                }, {
                    name: 'French Southern and Antarctic Lands',
                    value: 268.065
                }, {
                    name: 'Australia',
                    value: 22404.488
                }, {
                    name: 'Austria',
                    value: 8401.924
                }, {
                    name: 'Azerbaijan',
                    value: 9094.718
                }, {
                    name: 'Burundi',
                    value: 9232.753
                }, {
                    name: 'Belgium',
                    value: 10941.288
                }, {
                    name: 'Benin',
                    value: 9509.798
                }, {
                    name: 'Burkina Faso',
                    value: 15540.284
                }, {
                    name: 'Bangladesh',
                    value: 151125.475
                }, {
                    name: 'Bulgaria',
                    value: 7389.175
                }, {
                    name: 'The Bahamas',
                    value: 66402.316
                }, {
                    name: 'Bosnia and Herzegovina',
                    value: 3845.929
                }, {
                    name: 'Belarus',
                    value: 9491.07
                }, {
                    name: 'Belize',
                    value: 308.595
                }, {
                    name: 'Bermuda',
                    value: 64.951
                }, {
                    name: 'Bolivia',
                    value: 716.939
                }, {
                    name: 'Brazil',
                    value: 195210.154
                }, {
                    name: 'Brunei',
                    value: 27.223
                }, {
                    name: 'Bhutan',
                    value: 716.939
                }, {
                    name: 'Botswana',
                    value: 1969.341
                }, {
                    name: 'Central African Republic',
                    value: 4349.921
                }, {
                    name: 'Canada',
                    value: 34126.24
                }, {
                    name: 'Switzerland',
                    value: 7830.534
                }, {
                    name: 'Chile',
                    value: 17150.76
                }, {
                    name: 'China',
                    value: 1359821.465
                }, {
                    name: 'Ivory Coast',
                    value: 60508.978
                }, {
                    name: 'Cameroon',
                    value: 20624.343
                }, {
                    name: 'Democratic Republic of the Congo',
                    value: 62191.161
                }, {
                    name: 'Republic of the Congo',
                    value: 3573.024
                }, {
                    name: 'Colombia',
                    value: 46444.798
                }, {
                    name: 'Costa Rica',
                    value: 4669.685
                }, {
                    name: 'Cuba',
                    value: 11281.768
                }, {
                    name: 'Northern Cyprus',
                    value: 1.468
                }, {
                    name: 'Cyprus',
                    value: 1103.685
                }, {
                    name: 'Czech Republic',
                    value: 10553.701
                }, {
                    name: 'Germany',
                    value: 83017.404
                }, {
                    name: 'Djibouti',
                    value: 834.036
                }, {
                    name: 'Denmark',
                    value: 5550.959
                }, {
                    name: 'Dominican Republic',
                    value: 10016.797
                }, {
                    name: 'Algeria',
                    value: 37062.82
                }, {
                    name: 'Ecuador',
                    value: 15001.072
                }, {
                    name: 'Egypt',
                    value: 78075.705
                }, {
                    name: 'Eritrea',
                    value: 5741.159
                }, {
                    name: 'Spain',
                    value: 46182.038
                }, {
                    name: 'Estonia',
                    value: 1298.533
                }, {
                    name: 'Ethiopia',
                    value: 87095.281
                }, {
                    name: 'Finland',
                    value: 5367.693
                }, {
                    name: 'Fiji',
                    value: 860.559
                }, {
                    name: 'Falkland Islands',
                    value: 49.581
                }, {
                    name: 'France',
                    value: 63230.866
                }, {
                    name: 'Gabon',
                    value: 1556.222
                }, {
                    name: 'United Kingdom',
                    value: 62066.35
                }, {
                    name: 'Georgia',
                    value: 4388.674
                }, {
                    name: 'Ghana',
                    value: 24262.901
                }, {
                    name: 'Guinea',
                    value: 10876.033
                }, {
                    name: 'Gambia',
                    value: 1680.64
                }, {
                    name: 'Guinea Bissau',
                    value: 10876.033
                }, {
                    name: 'Equatorial Guinea',
                    value: 696.167
                }, {
                    name: 'Greece',
                    value: 11109.999
                }, {
                    name: 'Greenland',
                    value: 56.546
                }, {
                    name: 'Guatemala',
                    value: 14341.576
                }, {
                    name: 'French Guiana',
                    value: 231.169
                }, {
                    name: 'Guyana',
                    value: 786.126
                }, {
                    name: 'Honduras',
                    value: 7621.204
                }, {
                    name: 'Croatia',
                    value: 4338.027
                }, {
                    name: 'Haiti',
                    value: 9896.4
                }, {
                    name: 'Hungary',
                    value: 10014.633
                }, {
                    name: 'Indonesia',
                    value: 240676.485
                }, {
                    name: 'India',
                    value: 1205624.648
                }, {
                    name: 'Ireland',
                    value: 4467.561
                }, {
                    name: 'Iran',
                    value: 240676.485
                }, {
                    name: 'Iraq',
                    value: 30962.38
                }, {
                    name: 'Iceland',
                    value: 318.042
                }, {
                    name: 'Israel',
                    value: 7420.368
                }, {
                    name: 'Italy',
                    value: 60508.978
                }, {
                    name: 'Jamaica',
                    value: 2741.485
                }, {
                    name: 'Jordan',
                    value: 6454.554
                }, {
                    name: 'Japan',
                    value: 127352.833
                }, {
                    name: 'Kazakhstan',
                    value: 15921.127
                }, {
                    name: 'Kenya',
                    value: 40909.194
                }, {
                    name: 'Kyrgyzstan',
                    value: 5334.223
                }, {
                    name: 'Cambodia',
                    value: 14364.931
                }, {
                    name: 'South Korea',
                    value: 51452.352
                }, {
                    name: 'Kosovo',
                    value: 97.743
                }, {
                    name: 'Kuwait',
                    value: 2991.58
                }, {
                    name: 'Laos',
                    value: 6395.713
                }, {
                    name: 'Lebanon',
                    value: 4341.092
                }, {
                    name: 'Liberia',
                    value: 3957.99
                }, {
                    name: 'Libya',
                    value: 6040.612
                }, {
                    name: 'Sri Lanka',
                    value: 20758.779
                }, {
                    name: 'Lesotho',
                    value: 2008.921
                }, {
                    name: 'Lithuania',
                    value: 3068.457
                }, {
                    name: 'Luxembourg',
                    value: 507.885
                }, {
                    name: 'Latvia',
                    value: 2090.519
                }, {
                    name: 'Morocco',
                    value: 31642.36
                }, {
                    name: 'Moldova',
                    value: 103.619
                }, {
                    name: 'Madagascar',
                    value: 21079.532
                }, {
                    name: 'Mexico',
                    value: 117886.404
                }, {
                    name: 'Macedonia',
                    value: 507.885
                }, {
                    name: 'Mali',
                    value: 13985.961
                }, {
                    name: 'Myanmar',
                    value: 51931.231
                }, {
                    name: 'Montenegro',
                    value: 620.078
                }, {
                    name: 'Mongolia',
                    value: 2712.738
                }, {
                    name: 'Mozambique',
                    value: 23967.265
                }, {
                    name: 'Mauritania',
                    value: 3609.42
                }, {
                    name: 'Malawi',
                    value: 15013.694
                }, {
                    name: 'Malaysia',
                    value: 28275.835
                }, {
                    name: 'Namibia',
                    value: 2178.967
                }, {
                    name: 'New Caledonia',
                    value: 246.379
                }, {
                    name: 'Niger',
                    value: 15893.746
                }, {
                    name: 'Nigeria',
                    value: 159707.78
                }, {
                    name: 'Nicaragua',
                    value: 5822.209
                }, {
                    name: 'Netherlands',
                    value: 16615.243
                }, {
                    name: 'Norway',
                    value: 4891.251
                }, {
                    name: 'Nepal',
                    value: 26846.016
                }, {
                    name: 'New Zealand',
                    value: 4368.136
                }, {
                    name: 'Oman',
                    value: 2802.768
                }, {
                    name: 'Pakistan',
                    value: 173149.306
                }, {
                    name: 'Panama',
                    value: 3678.128
                }, {
                    name: 'Peru',
                    value: 29262.83
                }, {
                    name: 'Philippines',
                    value: 93444.322
                }, {
                    name: 'Papua New Guinea',
                    value: 6858.945
                }, {
                    name: 'Poland',
                    value: 38198.754
                }, {
                    name: 'Puerto Rico',
                    value: 3709.671
                }, {
                    name: 'North Korea',
                    value: 1.468
                }, {
                    name: 'Portugal',
                    value: 10589.792
                }, {
                    name: 'Paraguay',
                    value: 6459.721
                }, {
                    name: 'Qatar',
                    value: 1749.713
                }, {
                    name: 'Romania',
                    value: 21861.476
                }, {
                    name: 'Russia',
                    value: 21861.476
                }, {
                    name: 'Rwanda',
                    value: 10836.732
                }, {
                    name: 'Western Sahara',
                    value: 514.648
                }, {
                    name: 'Saudi Arabia',
                    value: 27258.387
                }, {
                    name: 'Sudan',
                    value: 35652.002
                }, {
                    name: 'South Sudan',
                    value: 9940.929
                }, {
                    name: 'Senegal',
                    value: 12950.564
                }, {
                    name: 'Solomon Islands',
                    value: 526.447
                }, {
                    name: 'Sierra Leone',
                    value: 5751.976
                }, {
                    name: 'El Salvador',
                    value: 6218.195
                }, {
                    name: 'Somaliland',
                    value: 9636.173
                }, {
                    name: 'Somalia',
                    value: 9636.173
                }, {
                    name: 'Republic of Serbia',
                    value: 3573.024
                }, {
                    name: 'Suriname',
                    value: 524.96
                }, {
                    name: 'Slovakia',
                    value: 5433.437
                }, {
                    name: 'Slovenia',
                    value: 2054.232
                }, {
                    name: 'Sweden',
                    value: 9382.297
                }, {
                    name: 'Swaziland',
                    value: 1193.148
                }, {
                    name: 'Syria',
                    value: 7830.534
                }, {
                    name: 'Chad',
                    value: 11720.781
                }, {
                    name: 'Togo',
                    value: 6306.014
                }, {
                    name: 'Thailand',
                    value: 66402.316
                }, {
                    name: 'Tajikistan',
                    value: 7627.326
                }, {
                    name: 'Turkmenistan',
                    value: 5041.995
                }, {
                    name: 'East Timor',
                    value: 10016.797
                }, {
                    name: 'Trinidad and Tobago',
                    value: 1328.095
                }, {
                    name: 'Tunisia',
                    value: 10631.83
                }, {
                    name: 'Turkey',
                    value: 72137.546
                }, {
                    name: 'United Republic of Tanzania',
                    value: 44973.33
                }, {
                    name: 'Uganda',
                    value: 33987.213
                }, {
                    name: 'Ukraine',
                    value: 46050.22
                }, {
                    name: 'Uruguay',
                    value: 3371.982
                }, {
                    name: 'United States of America',
                    value: 312247.116
                }, {
                    name: 'Uzbekistan',
                    value: 27769.27
                }, {
                    name: 'Venezuela',
                    value: 236.299
                }, {
                    name: 'Vietnam',
                    value: 89047.397
                }, {
                    name: 'Vanuatu',
                    value: 236.299
                }, {
                    name: 'West Bank',
                    value: 13.565
                }, {
                    name: 'Yemen',
                    value: 22763.008
                }, {
                    name: 'South Africa',
                    value: 51452.352
                }, {
                    name: 'Zambia',
                    value: 13216.985
                }, {
                    name: 'Zimbabwe',
                    value: 13076.978
                }]
            }]
        });

    }


    $('#p_names').change(function() {
        $('.animationload').css({ opacity: 1, visibility: 'visible' });
        var str = "";
        $("select option:selected").each(function() {
            str += $(this).text();
        });
        top.selected_name = str + ".csv";

        $(".player_name").text(str);


        setTimeout(function() {
            analysis(top.selected_name)
        }, 750);
        setTimeout(function() {
            $('.animationload').css({ opacity: 0, visibility: 'hidden' });
        }, 1500);


    })

    $("#injury-dates").click(function() {
        $('input[name="daterange"]').daterangepicker({
            opens: 'left'
        }, function(start, end, label) {
            console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        });
    });


    setTimeout(function() {
        analysis();
        // $('.animationload').css({opacity:0,visibility:'hidden'}); 
    }, 800);
    setTimeout(function() {
        // analysis();
        $('.animationload').css({ opacity: 0, visibility: 'hidden' });
    }, 1700);

}

// $('#p_names').change( function() {
// 	console.log('ffff', $(this))


// 	});


$(document).ready(function() {

    init_sparklines();
    init_flot_chart();
    init_sidebar();
    init_wysiwyg();
    init_InputMask();
    init_JQVmap();
    init_cropper();
    init_knob();
    init_IonRangeSlider();
    init_ColorPicker();
    init_TagsInput();
    init_parsley();
    init_daterangepicker();
    init_daterangepicker_right();
    init_daterangepicker_single_call();
    init_daterangepicker_reservation();
    init_SmartWizard();
    init_EasyPieChart();
    init_charts();
    init_echarts();
    init_morris_charts();
    init_skycons();
    init_select2();
    init_validator();
    init_DataTables();
    init_chart_doughnut();
    init_gauge();
    init_PNotify();
    init_starrr();
    init_calendar();
    init_compose();
    init_CustomNotification();
    init_autosize();
    init_autocomplete();


});