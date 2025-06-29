"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  subscriptionType: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    isPremium: boolean;
    premiumExpiry: string | null;
  };
}

interface PaymentsData {
  payments: Payment[];
  totalCount: number;
  limit: number;
  offset: number;
}

export default function PaymentsSection() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    limit: 50,
    offset: 0,
  });
  const [activatingPayment, setActivatingPayment] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadPayments();
  }, [pagination.offset]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/payments?limit=${pagination.limit}&offset=${pagination.offset}`
      );
      if (response.ok) {
        const data: PaymentsData = await response.json();
        setPayments(data.payments);
        setPagination((prev) => ({
          ...prev,
          totalCount: data.totalCount,
        }));
      }
    } catch (error) {
      console.error("Ошибка загрузки платежей:", error);
    } finally {
      setLoading(false);
    }
  };

  const activatePremium = async (paymentId: string) => {
    setActivatingPayment(paymentId);
    try {
      const response = await fetch("/api/admin/activate-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Премиум успешно активирован!");
        loadPayments(); // Перезагружаем данные
      } else {
        alert(data.error || "Ошибка активации премиума");
      }
    } catch (error) {
      console.error("Ошибка активации:", error);
      alert("Ошибка активации премиума");
    } finally {
      setActivatingPayment(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "succeeded":
        return "Успешно";
      case "canceled":
        return "Отменен";
      case "pending":
        return "В ожидании";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const nextPage = () => {
    if (pagination.offset + pagination.limit < pagination.totalCount) {
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  };

  const prevPage = () => {
    if (pagination.offset > 0) {
      setPagination((prev) => ({
        ...prev,
        offset: Math.max(0, prev.offset - prev.limit),
      }));
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Загрузка платежей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl text-white">Платежи</h2>
        </div>
        <p className="text-white/70">Всего платежей: {pagination.totalCount}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left p-4 text-white/80">ID платежа</th>
              <th className="text-left p-4 text-white/80">Пользователь</th>
              <th className="text-left p-4 text-white/80">Сумма</th>
              <th className="text-left p-4 text-white/80">Тип</th>
              <th className="text-left p-4 text-white/80">Статус</th>
              <th className="text-left p-4 text-white/80">Премиум</th>
              <th className="text-left p-4 text-white/80">Дата</th>
              <th className="text-left p-4 text-white/80">Действия</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <td className="p-4">
                  <span className="text-white/70 font-mono text-sm">
                    {payment.id.slice(-8)}...
                  </span>
                </td>
                <td className="p-4">
                  <div>
                    <div className="text-white text-sm">
                      {payment.user.name || "Без имени"}
                    </div>
                    <div className="text-white/70 text-xs">
                      {payment.user.email}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-white">{payment.amount} ₽</span>
                </td>
                <td className="p-4">
                  <span className="text-white/80 capitalize">
                    {payment.subscriptionType === "monthly" ? "Месяц" : "Год"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <span className="text-white/80">
                      {getStatusText(payment.status)}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  {payment.user.isPremium ? (
                    <div className="text-green-400 text-sm">
                      ✅ Активен
                      {payment.user.premiumExpiry && (
                        <div className="text-white/70 text-xs">
                          до {formatDate(payment.user.premiumExpiry)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-red-400 text-sm">❌ Не активен</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="text-white/70 text-sm">
                    {formatDate(payment.createdAt)}
                  </span>
                </td>
                <td className="p-4">
                  {payment.status === "succeeded" &&
                    !payment.user.isPremium && (
                      <Button
                        size="sm"
                        onClick={() => activatePremium(payment.id)}
                        disabled={activatingPayment === payment.id}
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        {activatingPayment === payment.id ? (
                          <div className="flex items-center gap-1">
                            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                            <span>Активация...</span>
                          </div>
                        ) : (
                          "🔥 Активировать премиум"
                        )}
                      </Button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalCount > pagination.limit && (
        <div className="p-4 border-t border-white/20 flex justify-between items-center">
          <div className="text-white/70 text-sm">
            Показано {pagination.offset + 1}-
            {Math.min(
              pagination.offset + pagination.limit,
              pagination.totalCount
            )}{" "}
            из {pagination.totalCount}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={prevPage}
              disabled={pagination.offset === 0}
              className="bg-white/10 hover:bg-white/20"
            >
              ← Назад
            </Button>
            <Button
              size="sm"
              onClick={nextPage}
              disabled={
                pagination.offset + pagination.limit >= pagination.totalCount
              }
              className="bg-white/10 hover:bg-white/20"
            >
              Вперед →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
