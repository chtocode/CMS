import { Button, Result, Steps } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import AddCourseForm from '../../../components/course/add-course';
import UpdateChapterForm from '../../../components/course/update-chapter';
import { useUserType } from '../../../components/custom-hooks/login-state';
import AppLayout from '../../../components/layout/layout';
import { Course } from '../../../lib/model';

const { Step } = Steps;

export default function Page() {
  const [step, setStep] = useState(0);
  const [availableNavigate, setAvailableNavigate] = useState<number[]>([0]);
  const [courseId, setCourseId] = useState(null);
  const [processId, setProcessId] = useState(null);
  const router = useRouter();
  const userType = useUserType();
  const moveToNex = () => {
    setStep(step + 1);
    setAvailableNavigate([...availableNavigate, step + 1]);
  };
  const steps = [
    {
      title: 'Course Detail',
      content: (
        <AddCourseForm
          onSuccess={(course: Course) => {
            setCourseId(course.id);
            setProcessId(course.processId);
            moveToNex();
          }}
        />
      ),
    },
    {
      title: 'Chapter Detail',
      content: (
        <UpdateChapterForm courseId={courseId} processId={processId} onSuccess={moveToNex} />
      ),
    },
    {
      title: '',
      content: (
        <Result
          status="success"
          title="Successfully Create Course!"
          extra={[
            <Button
              type="primary"
              key="detail"
              onClick={() => router.push(`/dashboard/${userType}/courses/${courseId}`)} // !跳转后mirage状态丢失，新的的数据找不到，所以这里会报500
            >
              Go Course
            </Button>,
            <Button
              key="again"
              onClick={() => {
                router.reload();
              }}
            >
              Create Again
            </Button>,
          ]}
        />
      ),
    },
  ];

  return (
    <AppLayout>
      <Steps
        current={step}
        type="navigation"
        onChange={(current) => {
          if (availableNavigate.includes(current)) {
            setStep(current);
          }
        }}
        style={{ padding: '1em 1.6%', margin: '20px 0' }}
      >
        <Step title="Course Detail" />
        <Step title="Chapter Detail" />
        <Step title="Success" />
      </Steps>

      {steps.map(({ title, content }, index) => (
        <div key={index} style={{ display: index === step ? 'block' : 'none' }}>
          <h2 style={{ marginLeft: '1.6%' }}>{title}</h2>
          {content}
        </div>
      ))}
    </AppLayout>
  );
}
