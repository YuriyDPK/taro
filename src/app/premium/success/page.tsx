"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

interface PaymentStatus {
  id: string;
  status: string;
  amount: number;
  subscriptionType: string;
  description: string;
  createdAt: string;
}

function PremiumSuccessContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!session) return;

      // Получаем ID платежа из URL параметров или localStorage
      const paymentId =
        searchParams.get("paymentId") || localStorage.getItem("lastPaymentId");

      if (!paymentId) {
        setError("Не найден ID платежа");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/payments/status/${paymentId}`);
        const data = await response.json();

        if (response.ok) {
          setPaymentStatus(data);
          localStorage.removeItem("lastPaymentId"); // Очищаем после успешной проверки
        } else {
          setError(data.error || "Ошибка проверки платежа");
        }
      } catch (err) {
        setError("Ошибка соединения с сервером");
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [session, searchParams]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Необходима авторизация</h1>
          <Link href="/auth/signin">
            <Button>Войти в аккаунт</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-2xl text-white mb-4">
            Проверяем статус платежа...
          </h1>
          <p className="text-white/70">Это может занять несколько секунд</p>
        </div>
      </div>
    );
  }

  if (error || !paymentStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl text-white mb-4">Ошибка проверки платежа</h1>
          <p className="text-white/70 mb-6">{error || "Неизвестная ошибка"}</p>
          <div className="flex flex-col lg:flex-row gap-4 justify-center">
            <Link href="/premium">
              <Button>Вернуться к премиум</Button>
            </Link>
            <Link href="/support">
              <Button>Связаться с поддержкой</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSucceeded = paymentStatus.status === "succeeded";
  const subscriptionText =
    paymentStatus.subscriptionType === "monthly" ? "на 1 месяц" : "на 1 год";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {isSucceeded ? (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl text-white mb-4">Поздравляем!</h1>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
              <h2 className="text-xl text-white mb-3">
                Premium подписка активирована
              </h2>
              <div className="space-y-2 text-white/80">
                <p>
                  <strong>Тип:</strong> {subscriptionText}
                </p>
                <p>
                  <strong>Сумма:</strong> {paymentStatus.amount} ₽
                </p>
                <p>
                  <strong>Статус:</strong>{" "}
                  <span className="text-green-400">Оплачено</span>
                </p>
              </div>
            </div>
            <div className="space-y-3 text-white/70 mb-6">
              <p>✨ Теперь вам доступны все премиум функции:</p>
              <ul className="text-left space-y-1">
                <li>• Безлимитные расклады Таро</li>
                <li>• Эксклюзивные расклады</li>
                <li>• Подробные интерпретации</li>
                <li>• Приоритетная поддержка</li>
                <li>• Доступ к новым функциям</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6">⏳</div>
            <h1 className="text-2xl text-white mb-4">Платеж в обработке</h1>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
              <div className="space-y-2 text-white/80">
                <p>
                  <strong>Сумма:</strong> {paymentStatus.amount} ₽
                </p>
                <p>
                  <strong>Статус:</strong>{" "}
                  <span className="text-yellow-400">Обрабатывается</span>
                </p>
              </div>
            </div>
            <p className="text-white/70 mb-6">
              Платеж успешно создан и находится в обработке. Премиум подписка
              будет активирована автоматически после подтверждения.
            </p>
          </>
        )}

        <div className="flex gap-4 justify-center">
          <Link href="/spreads">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
              🔮 К раскладам
            </Button>
          </Link>
          <Link href="/profile">
            <Button>👤 Профиль</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PremiumSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
            <h1 className="text-2xl text-white mb-4">Загрузка...</h1>
          </div>
        </div>
      }
    >
      <PremiumSuccessContent />
    </Suspense>
  );
}
