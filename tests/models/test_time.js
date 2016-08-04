import assert from 'assert';

import { Time } from '../../app/models/time';

describe('Time', function() {
  describe('#toString()', function() {
    it('Truncates times ending in :00', function() {
      assert.equal(new Time('Tu 9:00AM - 2:30PM').toString(), 'Tu 9 AM - 2:30 PM');
    });


    it('Add 1 to times ending in :29 or :59', function() {
      assert.equal(new Time('We 8:59AM - 2:29PM').toString(), 'We 9 AM - 2:30 PM');
    });

    it('Handles 12 PM being after 11 AM', function() {
      assert.equal(new Time('Th 8:59AM - 11:59AM').toString(), 'Th 9 AM - 12 PM');
    });

    it('Doesn\'t say AM or PM twice', function() {
      assert.equal(new Time('Th 11:59AM - 3:29PM').toString(), 'Th 12-3:30 PM');
      assert.equal(new Time('Th 8:29AM - 9:29AM').toString(), 'Th 8:30-9:30 AM');
    });

    it('Can handle 24h, one letter day format', function() {
      assert.equal(new Time('M 9:29 - 14:29').toString(), 'Mo 9:30 AM - 2:30 PM');
    });

    it('Can handle multiple days', function() {
      assert.equal(new Time('MWF 9:00 - 9:59').toString(), 'MoWeFr 9-10 AM');
    });

    it('Only uses the first time present', function() {
      assert.equal(new Time('Th 8:59AM - 11:59AM\n' +
                            'Th 6:00PM - 9:00PM\n' +
                            'We 7:00PM - 11:00PM').toString(), 'Th 9 AM - 12 PM');
    });
  });;
});
