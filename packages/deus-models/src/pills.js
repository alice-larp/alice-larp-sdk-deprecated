var _ = require('lodash');
var medicHelpers = require('../helpers/medic-helper.js')();

function useCure(api, pill) {
    // нет болезней - нет лечения
}

function useStamm(api, pill) {
    if (api.model.profileType !== 'human') return;

    if (api.model.genome) {
        _.set(api.model, ['genome', pill.affectedGenomePos], pill.affectedGenomeVal);
    }
}

function useAid(api, pill) {
    if (api.model.profileType !== 'human') return;

    medicHelpers.restoreDamage(api, 1);
    if (api.model.genome && _.get(api.model, ['usedPills', pill.id])) {
        _.set(api.model, ['genome', pill.affectedGenomePos], pill.affectedGenomeVal);
    }
}

function usePill(api, data, event) {
    if (!api.model.isAlive) return;

    let code = api.aquired('pills', data.id);
    if (!code) return;

    let pill = api.getCatalogObject('pills', code.pillId);
    if (!pill) return;

    switch (pill.pillType) {
    case 'cure':
        useCure(api, pill);
        break;
    case 'stamm':
        useStamm(api, pill);
        break;
    case 'aid':
        useAid(api, pill);
        break;
    }

    _.set(api.model, ['usedPills', pill.id], event.timestamp);
    code.usedAt = event.timestamp;
    code.usedBy = api.model._id;
}

function aquirePills(api, events) {
    if (!api.model.isAlive) return;

    events
        .filter((event) => event.eventType == 'usePill')
        .forEach((event) => api.aquire('pills', event.data.id));
}

module.exports = {
    _preprocess: aquirePills,
    usePill
};