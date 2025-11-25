// app/reserve/[eventId]/page.tsx
import { ReserveFoodForm } from '../../../components/ReserveFoodForm';

// 模拟事件数据 - 后续替换为真实API调用
const getEventById = (id: string) => {
  const mockEvents = [
    {
      id: 1,
      name: "CS Department Social",
      location: "Computer Science Building, Room 101",
      foodItems: ["Pizza", "Soda", "Chips", "Cookies"],
      availablePortions: 15
    },
    {
      id: 2,
      name: "Business Conference",
      location: "Questrom School of Business",
      foodItems: ["Sandwiches", "Salad", "Fruit", "Cookies"],
      availablePortions: 20
    }
  ];
  return mockEvents.find(event => event.id === parseInt(id)) || mockEvents[0];
};

interface ReservePageProps {
  params: {
    eventId: string;
  };
}

export default function ReservePage({ params }: ReservePageProps) {
  const event = getEventById(params.eventId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ReserveFoodForm event={event} />
      </div>
    </div>
  );
}