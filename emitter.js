'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function delLastLevelOfHierarchy(event) {
    let lvl = event.split('.');
    lvl.pop();

    return lvl.join('.');
}

/**
* Преобразовать событие вида xxx.yyy в [xxx.yyy, xxx]
* @param {String} event
* @returns {Array}
*/
function getHierarchyEvents(event) {
    let hierarchyEvents = [];
    let eventCopy = event;
    if (event.indexOf('.') === -1) {
        return [event];
    }
    for (let i = event.split('.').length; i > 0; i--) {
        hierarchyEvents[event.split('.').length - i] = eventCopy;
        eventCopy = delLastLevelOfHierarchy(eventCopy);
    }

    return hierarchyEvents;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!(event in events)) {
                events[event] = [];
            }
            events[event].push({
                student: context,
                func: handler.bind(context)
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            let eventsForDelete = Object.keys(events).filter(storedEvent =>
                storedEvent.indexOf(event + '.') === 0 || event === storedEvent);
            eventsForDelete.forEach(eventForDelete => {
                events[eventForDelete] = events[eventForDelete].filter(
                    subscriber => subscriber.student !== context);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let hierarchyEvents = getHierarchyEvents(event);
            for (let j = 0; j < hierarchyEvents.length; j++) {
                if (!(events[hierarchyEvents[j]] === undefined)) {
                    let students = events[hierarchyEvents[j]];
                    students.map(student => student.func());
                }
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}
