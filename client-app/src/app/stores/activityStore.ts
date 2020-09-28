import { observable, action, computed, configure, runInAction} from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../layout/models/activity";

configure({enforceActions: 'always'})

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()))
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    )
    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date = activity.date.split('T')[0];
      activities[date] = activities[date] ? [...activities[date] ,activity] : [activity]
      return activities
    }, {} as {[key: string]: IActivity[]}));
  }

  @action loadActivites = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activites.list();
      runInAction('loading activities', () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
      console.log(this.groupActivitiesByDate(activities));

    } catch (error) { 
      runInAction('loading activities error', () => {
        this.loadingInitial = false;
      })
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity){
      this.activity = activity
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activites.details(id);
        runInAction('getting activity', () => {
          this.activity = activity;
          this.loadingInitial = false;

        })
      } catch(error){
        runInAction('get Activity error', () => {
          this.loadingInitial = false;
        })
        console.log(error)
      }
    }

  }

  @action clearActivity = () => {
    this.activity = null;
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activites.create(activity);
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      })

    } catch (error) {
      runInAction('creating activity error', () => {
        this.submitting = false;
      })

      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
      this.submitting = true;
      try{
          await agent.Activites.update(activity);
          runInAction('editing activity', () => {
            this.activityRegistry.set(activity.id, activity)
            this.activity = activity;
            this.submitting = false;
          } )

      } catch (error) {
        runInAction('editing activity error', () => {
          this.submitting = false;
        })
        console.log(error)
      }
  }

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        console.log(this.target)
        try {
            await agent.Activites.delete(id);
            runInAction('deleting Activity', () => {
              this.activityRegistry.delete(id);
              this.submitting = false;
              this.target = '';
            })
        }catch (error){
          runInAction('deleting Activity error', () => {
            this.submitting = false;
            this.target = '';
          })
            console.log(error); 
        }
  };
}

export default createContext(new ActivityStore());
