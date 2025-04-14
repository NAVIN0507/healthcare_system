import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-3xl font-semibold text-primary-600 mb-4">Welcome to Healthcare Management System</h2>
        <p className="text-neutral-600">Streamline your healthcare operations with our comprehensive management solution.</p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-secondary-500 text-xl mb-2">Total Patients</div>
          <div className="text-4xl font-bold text-neutral-800">1,234</div>
        </div>
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-secondary-500 text-xl mb-2">Today's Appointments</div>
          <div className="text-4xl font-bold text-neutral-800">28</div>
        </div>
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="text-secondary-500 text-xl mb-2">Available Doctors</div>
          <div className="text-4xl font-bold text-neutral-800">12</div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="bg-white rounded-lg shadow-soft p-6">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            New Patient
          </button>
          <button className="p-4 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors">
            Schedule Appointment
          </button>
          <button className="p-4 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors">
            View Schedule
          </button>
          <button className="p-4 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
            Emergency Contact
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-lg shadow-soft p-6">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="font-medium text-neutral-800">New patient registration</p>
              <p className="text-sm text-neutral-500">John Doe - 10:30 AM</p>
            </div>
            <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">Completed</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="font-medium text-neutral-800">Appointment rescheduled</p>
              <p className="text-sm text-neutral-500">Sarah Smith - 09:15 AM</p>
            </div>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Updated</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="font-medium text-neutral-800">Lab results uploaded</p>
              <p className="text-sm text-neutral-500">Mike Johnson - 08:45 AM</p>
            </div>
            <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">New</span>
          </div>
        </div>
      </section>
    </div>
  );
}
