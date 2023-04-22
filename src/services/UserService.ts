import date from 'date-and-time'

export default {
   
   getCreationStatus: (cDate: Date | undefined): string =>
      cDate ? `Created: ${String(date.format(cDate, 'YYYY-M-D'))}` : 'Created:'
   ,
   
   getFollowStatus: (fDate: Date | undefined): string =>
      fDate ? `Following since: ${String(date.format(fDate, 'MMMM D, YYYY'))}` : `Not following`
   ,
   
   /**
    * @description If user account creation date and follow date are the same
    *              and if the user is following for less than 2 months, the user is probably a sock account
    */
   isSock: (creationDate: Date | undefined, followDate: Date | undefined): boolean | undefined =>
      (creationDate && followDate) && (date.isSameDay(creationDate, followDate) && date.subtract(new Date(Date.now()), followDate).toDays() < 60),
   
   isLessThanTwoMonthActive: (followDate: Date | undefined): boolean | undefined =>
      (followDate) && (date.subtract(new Date(Date.now()), followDate).toDays() <= 60),
   
   isLessThanTenDayActive: (followDate: Date | undefined): boolean | undefined =>
      (followDate) && (date.subtract(new Date(Date.now()), followDate).toDays() <= 10),
   
   justFollowed: (followDate: Date | undefined): boolean | undefined =>
      (followDate) && (date.subtract(new Date(Date.now()), followDate).toDays() <= 3),
   
   
}
