
export default () => `fragment dailyParts on ReasonDailyHours {
                        isClosed
                        availabilities {
                          startTime
                          endTime
                        }
                        breaks {
                          startTime
                          endTime
                        }
                      }
                      
                      query($reasonWeeklyHoursId: ID!) {
                        reasonWeeklyHours(reasonWeeklyHoursReadInput: { id: $reasonWeeklyHoursId }) {
                          mondayHours {
                            ...dailyParts
                          }
                          tuesdayHours {
                            ...dailyParts
                          }
                          wednesdayHours {
                            ...dailyParts
                          }
                          thursdayHours {
                            ...dailyParts
                          }
                          fridayHours {
                            ...dailyParts
                          }
                          saturdayHours {
                            ...dailyParts
                          }
                          sundayHours {
                            ...dailyParts
                          }
                        }
                      }`;
