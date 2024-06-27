import { Request, Response } from 'express';
import Plan from '../models/plan';
import Joi from 'joi';

/* const userSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  }),
  isAdmin: Joi.boolean().optional()
}) */

const planSchema = Joi.object({
  name: Joi.string().required(),
  features: Joi.string().allow('').optional(),
  resources: Joi.number().required(),
  price: Joi.number().required(),
  duration: Joi.number().required(),
});

export const createPlan = async (req: Request, res: Response) => {
  const { error } = planSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  const { error } = planSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find();
    if(plans.length == 0) return res.status(404).json({error: "No subscription plans found"});
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
