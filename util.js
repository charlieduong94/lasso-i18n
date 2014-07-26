module.exports = {
    normalizeLocaleCode: function(localeCode) {
        if (localeCode.charAt(2) === '-') {
            return localeCode.replace('-', '_');
        } else {
            return localeCode;
        }
    },

    /**
     * The method will return the most appropriate locale based on the
     * end-user's locale preference and available locales. This method will
     * handle both the "_" and "-" separator characters equally well.
     *
     * @param preferredLocale an array of locales (e.g. ['en', 'en_US'])
     *  or a string in the format of the Accept-Language header value
     *  (e.g. "en-US,en;q=0.8")
     *
     * @param availableLocales an array of locale codes
     *  (e.g. ["en", "en_US", ])
     *
     * @return the item in the availableLocales that is a best match or
     *  the empty string to indicate default locale
     */
    findBestLocale: function(preferredLocale, availableLocales) {
        if (!preferredLocale) {
            // use default locale
            return '';
        }

        if (!availableLocales || (availableLocales.length === 0)) {
            // assume default locale because availableLocales is not an array
            return '';
        }

        var localeMap = {};
        for (var i = 0; i < availableLocales.length; i++) {
            localeMap[this.normalizeLocaleCode(availableLocales[i])] = true;
        }

        var candidates;
        if (Array.isArray(preferredLocale)) {
            candidates = preferredLocale;
        } else {
            if (preferredLocale.indexOf(',') === -1) {
                candidates = [preferredLocale];
            } else {
                candidates = preferredLocale.split(',');
            }
        }

        for (var j = 0; j < candidates.length; j++) {

            preferredLocale = candidates[j];

            // chop off part past ';' if it exists
            var pos = preferredLocale.indexOf(';');
            if (pos !== -1) {
                preferredLocale = preferredLocale.substring(0, pos);
            }

            // normalize separator
            preferredLocale = this.normalizeLocaleCode(preferredLocale);

            if (localeMap[preferredLocale]) {
                return preferredLocale;
            }

            if (preferredLocale.charAt(2) === '_') {
                preferredLocale = preferredLocale.substring(0, 2);
                if (localeMap[preferredLocale]) {
                    return preferredLocale;
                }
            }
        }

        return '';
    }
};