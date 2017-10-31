'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
* Выполнить событие для студентов, которые на него подписаны
* @param {Array} studentsWithFunc
*/
function funcForStudents(studentsWithFunc) {
    for (let i = 0; i < studentsWithFunc.length; i++) {
        studentsWithFunc[i].func();
    }
}

/**
* Преобразовать событие вида в xxx.yyy в [xxx.yyy, xxx]
* @param {String} event
* @returns {Array}
*/
function eventToKeys(event) {
    let keys = [];
    let event_ = event;
    if (event_.indexOf('.') === -1) {
        return [event_];
    }
    for (let i = event.split('.').length; i > 0; i--) {
        keys[event.split('.').length - i] = event_;
        let arr = event_.split('.');
        arr.pop();
        event_ = arr.join('.');
    }

    return keys;
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
            let eventsForDelete = Object.keys(events).filter(
                storedEvent => storedEvent.indexOf(event + '.') === 0 || event === storedEvent);
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
            let keys = eventToKeys(event);
            for (let j = 0; j < keys.length; j++) {
                if (!(events[keys[j]] === undefined)) {
                    funcForStudents(events[keys[j]]);
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
