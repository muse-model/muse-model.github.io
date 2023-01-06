function setup() {
    logo_images = [
        {
            src: './assets/images/logo/muse_cake_1.jpg',
            caption: 'A birthday cake with "Muse" written on it.',
        },
        {
            src: './assets/images/logo/muse_fire.jpg',
            caption: 'A fireplace where the word "Muse" is spelled in the flames.',
        },
        {
            src: './assets/images/logo/muse_fountain_pen.jpg',
            caption: 'The word "Muse" drawn fluently on paper with a fountain pen.',
        },
        {
            src: './assets/images/logo/muse_cupcakes.jpg',
            caption:
                'a large array of colorful cupcakes, arranged on a maple table to spell "Muse"',
        },
        {
            src: './assets/images/logo/muse_latte.jpg',
            caption: 'A latte with "Muse" written in latte art',
        },
        {
            src: './assets/images/logo/muse_corgi.jpg',
            caption: 'A Welsh corgi holding a sign in its mouth that says "Muse".',
        },
        {
            src: './assets/images/logo/muse_fish.jpg',
            caption: 'A school of fish swirling around in the ocean to spell the letters "Muse".',
        },
        {
            src: './assets/images/logo/muse_van_gogh.jpg',
            caption: 'The word "Muse" painted on canvas by Vincent van Gogh.',
        },
    ];

    // Load captions.json and populate gallery_images
    $.getJSON('./assets/captions.json', function (data) {
        gallery_images = data;
        setTimeout(randomSwapImage, 6000, '#gallery0');
        setTimeout(randomSwapImage, 1000, '#gallery1');
        setupFlipGalleryBehavior();
    });
}

function setupFlipGalleryBehavior() {
    lastCardFlippedIdx = {
        gallery0: -1,
        gallery1: -1,
    };

    lastCardFlippedLastSwapTime = {
        gallery0: -1,
        gallery1: -1,
    };

    $('.flipcard').flip({
        trigger: 'manual',
        reverse: false,
    });

    for (id = 0; id < 8; id++) {
        setupGallery1(id);
    }

    $('#gallery0 #fig0').click(function () {
        randomSwapImageWithId('#gallery0', 0);
    });

    compositionalAnimalsManualClicked = false;
    compositionalMadeOfManualClicked = false;

    comp_files = {
        'Original (with mask)': './assets/images/inpaint/boston_masked.jpg',
        '"New York in the background"': './assets/images/inpaint/boston_nyc.jpg',
        '"Paris in the background"': './assets/images/inpaint/boston_paris.jpg',
        '"San Francisco in the background"': './assets/images/inpaint/boston_sf.jpg',
    };

    $('#compositional_animals p.selectable span').click(function () {
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        updateComposition('#compositional_animals');
        compositionalAnimalsManualClicked = true;
    });

    $('#compositional_madeof_img').click(function () {
        updateComposition('#compositional_madeof');
        compositionalAnimalsManualClicked = true;
    });

    $('#compositional_madeof p.selectable span').click(function () {
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        updateComposition('#compositional_madeof');
        compositionalMadeOfManualClicked = true;
    });
}

function checkIfImageIsVisible(name, image) {
    numCards = $(name + ' .flipcard:visible').size();
    for (var cardIdx = 0; cardIdx < numCards; ++cardIdx) {
        var isFlipped = $(name + ' #fig' + cardIdx).data('flip-model').isFlipped;
        if (!isFlipped) {
            src = $(name + ' #fig' + cardIdx + ' div.front figure img').attr('src');
        } else {
            src = $(name + ' #fig' + cardIdx + ' div.back figure img').attr('src');
        }

        if (image.src == src) {
            return true;
        }
    }
    return false;
}

function getNextImage(name) {
    // different galleries have different sources of imagery.
    if (name == '#gallery0') {
        img_src = logo_images;
    } else {
        img_src = gallery_images;
    }
    while (true && img_src.length > 0) {
        randomImageIdx = Math.floor(Math.random() * img_src.length);
        if (!checkIfImageIsVisible(name, img_src[randomImageIdx])) {
            return img_src[randomImageIdx];
        }
    }
}

function randomSwapImageWithId(name, randomCardIdx) {
    numCards = $(name + ' .flipcard:visible').size();

    image = getNextImage(name);

    const d = new Date();
    let currentTime = d.getTime();
    lastCardFlippedIdx[name] = randomCardIdx;
    lastCardFlippedLastSwapTime[name] = currentTime;

    var isFlipped = $(name + ' #fig' + randomCardIdx).data('flip-model').isFlipped;
    if (!isFlipped) {
        $(name + ' #fig' + randomCardIdx + ' div.back figure img').attr('src', image.src);
        $(name + ' #fig' + randomCardIdx + ' div.back figure figcaption').text(image.caption);
    } else {
        $(name + ' #fig' + randomCardIdx + ' div.front figure img').attr('src', image.src);
        $(name + ' #fig' + randomCardIdx + ' div.front figure figcaption').text(image.caption);
    }

    $(name + ' #fig' + randomCardIdx).flip('toggle');
}

function randomSwapImage(name) {
    numCards = $(name + ' .flipcard:visible').size();

    const d = new Date();
    if (d.getTime() - lastCardFlippedIdx[name] < 5000) {
        setTimeout(randomSwapImage, 1000, name);
        return;
    }

    do {
        randomCardIdx = Math.floor(Math.random() * numCards);
        if (numCards == 1) {
            break;
        }
    } while (randomCardIdx == lastCardFlippedIdx[name]);

    randomSwapImageWithId(name, randomCardIdx);
    setTimeout(randomSwapImage, 3000, name);
}

function setupGallery1(id) {
    randomSwapImageWithId('#gallery1', id);
    $('#gallery1 #fig' + id).click(function () {
        randomSwapImageWithId('#gallery1', id);
    });
}

function updateComposition(name) {
    var compositionSpans = $(name + ' p span.selected')
        .map(function () {
            return $(this).text();
        })
        .get();
    var compositionText = '';
    for (
        var compositionSpansIdx = 0;
        compositionSpansIdx < compositionSpans.length;
        ++compositionSpansIdx
    ) {
        if (compositionSpansIdx > 0) {
            compositionText += ' ';
        }
        compositionText += compositionSpans[compositionSpansIdx];
    }
    if (name == '#compositional_madeof') {
        if (compositionText == 'Original') {
            $(name + '_img').attr('src', './assets/images/edit_opt/orig.gif');
        } else {
            // Generate a random index that is not the one already selected
            randImgIdx = '/'; // something guaranteed to be in the path
            cur_src = $(name + '_img').attr('src');
            while (cur_src.search(randImgIdx) != -1) {
                randImgIdx = Math.floor(Math.random() * 4);
            }
            first_space = compositionText.search(' ');
            file = compositionText.slice(first_space + 1, -2).replaceAll(' ', '-');
            $(name + '_img').attr(
                'src',
                './assets/images/edit_opt/' + file + '_' + randImgIdx + '.gif'
            );
        }
    } else if (name == '#compositional_animals') {
        randImgIdx = Math.floor(Math.random() * 4);
        $(name + '_img').attr('src', comp_files[compositionText]);
    }
}

function randomComposition(name) {
    if (name == '#compositional_animals' && compositionalAnimalsManualClicked == true) {
        compositionalAnimalsManualClicked = false;
        setTimeout(randomComposition, 4000, name);
        return;
    } else if (name == '#compositional_madeof' && compositionalMadeOfManualClicked == true) {
        compositionalMadeOfManualClicked = false;
        setTimeout(randomComposition, 4000, name);
        return;
    }

    var compositionPs = $(name + ' p.selectable').toArray();
    var compositionOptions = [];
    for (var i = 0; i < compositionPs.length; ++i) {
        var compositionSpanSelected = $(compositionPs[i]).children('span.selected');
        var compositionSpans = $(compositionPs[i]).children('span').not('span.selected').toArray();
        for (var j = 0; j < compositionSpans.length; ++j) {
            compositionOption = {
                p: compositionPs[i],
                span_selected: compositionSpanSelected,
                span_option: $(compositionSpans[j]),
            };
            compositionOptions.push(compositionOption);
        }
    }

    randomCompositionOptionIdx = Math.floor(Math.random() * compositionOptions.length);
    randomCompositionOption = compositionOptions[randomCompositionOptionIdx];

    randomCompositionOption.span_selected.toggleClass('selected');
    randomCompositionOption.span_option.toggleClass('selected');

    updateComposition(name);
    setTimeout(randomComposition, 4000, name);
}

setup();
