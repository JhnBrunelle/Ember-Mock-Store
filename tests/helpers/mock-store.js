import Ember from 'ember';

export default Ember.Object.extend({

    // Create a new store
    init() {
        this._super();
        this.models = Ember.A([]);    // Create an empty array to act as the store
    },

    /**
     * Mock version of createRecord. saves record to this.models,
     * under it's modelName index
     *
     * @param {String} modelName Model Name
     * @param {Object} record Record to Add
     * @returns {Object} Complete Promise via returning original promise
     */
    createRecord(modelName, record=Ember.Object.create({})) {

        // Intercept save from reaching Ember Data
        record.save = () => {
            return new Ember.RSVP.Promise((resolve) => {
                resolve(record);
            });
        };

        // Overriding to maintain context, Model updates live
        record.set = (param,val) =>{
            Ember.set(record, param, val);
        };

        // deleteRecord also can be called from the record
        record.deleteRecord = () => {
            return this._removeRecord(modelName,record);
        };

        // our mock store autosaves, so destroyRecord = deleteRecord
        record.destroyRecord = () => {
            return this._removeRecord(modelName,record);
        };

        // Add model if it doesn't exist
        if (!this.models[modelName]) {
            this.models[modelName] = Ember.A([]);
        }

        // Add modelName property
        record.modelName = modelName;

        // Add record to model
        this.models[modelName].pushObject(record);

        return Ember.Object.create(record);
    },

    /**
     * Fake findAll method
     *
     * @param {String} modelName Name of the model
     * @returns {Object} Returns ember array of model
     */
    findAll(modelName){
        const model = this.models[modelName];
        const modelPA = Ember.ArrayProxy.create({
            content: Ember.A(model),

            // Simulate an RSVP Promise, without actually performing one
            // Accounts for findAll calls, without a .then() attached
            then: (callback) => {
                callback(modelPA);
            }
        });

        return modelPA;
    },

    /**
     * Adds a new record to the store
     *
     * @param {Object} data record wrapped in {data:[]} object
     * @returns {Array} Array of records added to the store
     */
    push(data){
        let dataArray = data.data;
        let returnArray =  [];
        for (let i = 0; i < dataArray.length; i++) {
            const currentItem = dataArray[i];
            const addedItem = this.createRecord(currentItem.type,currentItem.attributes);
            returnArray.push(addedItem);
        }
        return returnArray;
    },

    /**
     * Mock version of query. Searches this.models for record
     * based on query.
     *
     * @param {String} modelName Name of the model
     * @param {Object} query Object with parameters to search for
     * @returns {Ember.ArrayProxy} Mock DS.PromiseArray
     */
    query(modelName, query) {
        return new Ember.RSVP.Promise((resolve) => {

            // Grab the model from the store by name
            const model = this.models[modelName];

            // Find the model that matches the query
            let results = Ember.A([]);
            if (typeof model != 'undefined') {
                results = model.filter((item) => {
                    let result = true;

                    for (const prop in query) {
                        if (query.hasOwnProperty(prop)) {
                            if (!item[prop]) {
                                result = false;
                            }
                            else if (query[prop] !== item[prop]) {
                                result = false;
                            }
                        }
                    }

                    return result;
                });
            }


            // DS.store.query returns a DS.PromiseArray, so we should too!
            const mockPA = Ember.ArrayProxy.create({
                content: Ember.A(results),
                objectAtContent: (index) => {
                    return this.get('content').objectAt(index);
                }
            });

            resolve(mockPA);
        });
    },

    /**
     * Removes the record from our mock store.
     * Not to be confused with DS.store.deleteRecord().
     *
     * @private
     * @param {String} modelName type to remove
     * @param {Object} record to remove from store
     * @returns {Promise} returns promise
     */
    _removeRecord(modelName,record) {
        return new Ember.RSVP.Promise((resolve) => {
            this.models[modelName].removeObject(record);
            resolve(true);
        });
    },

    /**
     * Unload a record from our fake store
     *
     * @static
     * @param {Object} record Record to remove
     * @returns {void}
     */
    unloadRecord(record){
        this._removeRecord(record.modelName, record);
    }


});
