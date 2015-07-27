import Ember from "ember";
import EmberValidations from 'ember-validations';
/* global moment */

export default Ember.Controller.extend(EmberValidations.Mixin, {
  actions: {
    save: function(){
      // check if answer type is selected
      if (this.get('model.answerType') === null) {
        return;
      }

      // save poll
      var self = this;
      this.get('model').save().then(function(model){
        // reload as workaround for bug: duplicated records after save
        model.reload().then(function(model){
           // redirect to new poll
           self.get('target').send('transitionToPoll', model);
        });
      });
    },
    
    submit: function(){
      var self = this;
      this.validate().then(function() {
        self.send('save');
      }).catch(function(){
        Ember.$.each(Ember.View.views, function(id, view) {
          if(view.isEasyForm) {
            view.focusOut();
          }
        });
      });
    }
  },

  // proxy needed for validation
  anonymousUser: function() {
    return this.get('model.anonymousUser');
  }.property('model.anonymousUser'),

  // proxy needed for validation
  answerType: function() {
    return this.get('model.answerType');
  }.property('model.answerType'),
  
  answerTypes: function() {
    return [
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
          id : "YesNo",
          labelTranslation : "answerTypes.yesNo.label",
          answers : [
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "yes",
                    labelTranslation: "answerTypes.yes.label",
                    icon: "glyphicon glyphicon-thumbs-up"
                  }),
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "no",
                    labelTranslation: "answerTypes.no.label",
                    icon: "glyphicon glyphicon-thumbs-down"
                  })
              ]
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
          id : "YesNoMaybe",
          labelTranslation : "answerTypes.yesNoMaybe.label",
          answers : [
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "yes",
                    labelTranslation: "answerTypes.yes.label",
                    icon: "glyphicon glyphicon-thumbs-up"
                  }),
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "maybe",
                    labelTranslation: "answerTypes.maybe.label",
                    icon: "glyphicon glyphicon-hand-right"
                  }),
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "no",
                    labelTranslation: "answerTypes.no.label",
                    icon: "glyphicon glyphicon-thumbs-down"
                  })
              ]
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
          id : "FreeText",
          labelTranslation : "answerTypes.freeText.label",
          answers : []
      })
    ];
  }.property(),

  expirationDuration: 'P3M',

  expirationDurations: function() {
    return [
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P7D',
        labelTranslation: 'create.settings.expirationDurations.P7D'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P1M',
        labelTranslation: 'create.settings.expirationDurations.P1M'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P3M',
        labelTranslation: 'create.settings.expirationDurations.P3M'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P6M',
        labelTranslation: 'create.settings.expirationDurations.P6M'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P1Y',
        labelTranslation: 'create.settings.expirationDurations.P1Y'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: '',
        labelTranslation: 'create.settings.expirationDurations.never'
      })
    ];
  }.property(),

  forceAnswer: function() {
    return this.get('model.forceAnswer');
  }.property('model.forceAnswer'),
  
  /*
   * set answers depending on selected answer type
   */
  updateAnswers: function(){
    var selectedAnswer = this.get('model.answerType'),
        answers = [],
        answerTypes = this.get('answerTypes');

    if (selectedAnswer !== null) {
      for (var i=0; i < answerTypes.length; i++) {
        if (answerTypes[i].id === selectedAnswer) {
            answers = answerTypes[i].answers;
        }
      }

      this.set('model.answers', answers);
    }
  }.observes('model.answerType'),

  updateExpirationDate: function() {
    var expirationDuration = this.get('expirationDuration');
    
    if(Ember.isEmpty(expirationDuration)) {
      this.set('model.expirationDate', '');
    }
    else {
      this.set('model.expirationDate',
        moment().add(
          moment.duration(expirationDuration)
        ).toISOString()
      );
    }
  }.observes('expirationDuration'),

  validations: {
    anonymousUser: {
      presence: true
    },
    answerType: {
      presence: true,
      inclusion: {
          in: ["YesNo", "YesNoMaybe", "FreeText"]
      }
    },
    forceAnswer: {
      presence: true
    }
  }
});
