package com.geospock.presto.udfs.aggregation;

import static com.facebook.presto.spi.type.DoubleType.DOUBLE;

import com.facebook.presto.spi.block.BlockBuilder;
import com.facebook.presto.spi.function.AggregationFunction;
import com.facebook.presto.spi.function.CombineFunction;
import com.facebook.presto.spi.function.Description;
import com.facebook.presto.spi.function.InputFunction;
import com.facebook.presto.spi.function.OutputFunction;
import com.facebook.presto.spi.function.SqlType;
import com.facebook.presto.spi.type.StandardTypes;
import com.geospock.presto.udfs.aggregation.state.LongAndDoubleState;

@AggregationFunction("avg_between_limits")
@Description("Average value between a lower and an upper limit (inclusive)")
public class AverageBetweenLimits {

    private AverageBetweenLimits() {}

    @InputFunction
    public static void input(LongAndDoubleState state,
                             @SqlType(StandardTypes.DOUBLE) double value,
                             @SqlType(StandardTypes.DOUBLE) double lower,
                             @SqlType(StandardTypes.DOUBLE) double upper) {
        if (value <= upper && value >= lower) {
            state.setLong(state.getLong() + 1);
            state.setDouble(state.getDouble() + value);
        }
    }

    @CombineFunction
    public static void combine(LongAndDoubleState state, LongAndDoubleState otherState) {
        state.setLong(state.getLong() + otherState.getLong());
        state.setDouble(state.getDouble() + otherState.getDouble());
    }

    @OutputFunction(StandardTypes.DOUBLE)
    public static void output(LongAndDoubleState state, BlockBuilder out) {
        long count = state.getLong();
        if (count == 0) {
            out.appendNull();
        } else {
            double value = state.getDouble();
            DOUBLE.writeDouble(out, value / count);
        }
    }
}

