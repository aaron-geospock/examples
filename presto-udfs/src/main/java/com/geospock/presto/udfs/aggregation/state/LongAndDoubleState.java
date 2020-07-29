package com.geospock.presto.udfs.aggregation.state;

import com.facebook.presto.spi.function.AccumulatorState;

public interface LongAndDoubleState extends AccumulatorState {
    long getLong();

    void setLong(long value);

    double getDouble();

    void setDouble(double value);
}
