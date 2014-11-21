import Ember from "ember";

export default Ember.View.extend({
  classNames: ['datepicker'],

  didInsertElement: function() {
    var self = this;

    this._super();

    Ember.$('.datepicker').datepicker({
      format: "yyyy-mm-dd hh:mm:ss",
      multidate: true,
      multidateSeparator: ";",
      calendarWeeks: true,
      todayHighlight: true,
      language: this.get('controller.language.selected')
    })
    // bind date changes to option array in model
    .on('changeDate', function(e){
      var dates = e.dates,
          newDates = [];

      // sort dates
      dates.sort(function(a,b){
        return new Date(a) - new Date(b);
      });

      // get array in correct form
      dates.forEach(function(option) {
        newDates.pushObject({title: option});
      });

      // set options
      self.set('_parentView.controller.optionsDates', newDates);
    });
  }
});